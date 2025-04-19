import { useVirtualizer } from "@tanstack/react-virtual";
import { transferApi } from "apis/transfer.ts";
import { transactionApi } from "apis/transaction.ts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoadingContent from "components/LoadingContent.tsx";
import { Transaction } from "types/transaction.ts";
import { PAGE_LIMIT } from "constants/pagination.ts";
import useIntersectionObserver from "hooks/use-intersection-observer.tsx";
import { TransactionSection } from "modules/transaction/types/transaction.ts";
import { Button, Icon, Typography } from "@mui/material";
import TransactionListSection from "modules/transaction/features/TransactionListSection.tsx";
import { Icon as Iconify } from "@iconify/react";
import SearchTextField from "components/SearchTextField.tsx";
import * as dfns from "date-fns";
import useDebouncedState from "hooks/use-debounced-state.ts";
import useDataRef from "hooks/use-data-ref.ts";
import TransactionFilter, {
  TransactionFilterState,
} from "modules/transaction/features/TransactionFilter.tsx";
import DateFormat from "enums/date-format.ts";

function TransactionList(props: TransactionListProps) {
  const { hideFilter, noPagination } = props;

  const [filter, setFilter] = useState(
    () =>
      ({
        pageIndex: 0,
        limit: PAGE_LIMIT,
      }) as TransactionFilterState
  );

  const transactionsParentRef = useRef(null);

  const [infiniteTransactions, setInfiniteTransactions] = useState<{
    [x: string]: Transaction[];
  }>({});

  // const [pageState, setPageState] = useState(() => ({
  //   pageIndex: 0,
  //   limit: PAGE_LIMIT,
  // }));

  const [debouncedSearchQ, setSearchQ, searchQ] = useDebouncedState("", {
    wait: 500,
  });

  const transferWalletsQueryResult =
    transferApi.useGetTransferWalletsQuery(undefined);
  const transferWallets = transferWalletsQueryResult.data?.data;

  const mainWallet = transferWallets?.find(
    (wallet) => wallet.businessType === "Group"
  );

  const transactionSavingsHistoryQueryResult =
    transactionApi.useGetTransactionSavingsHistoryQuery(
      useMemo(
        () => ({
          path: { savingsAccountId: mainWallet?.walletId },
          params: {
            page: filter.pageIndex + 1,
            limit: filter.limit,
            accountNumber: debouncedSearchQ || undefined,
            transactionType: filter?.transactionType || undefined,
            dateFormat: DateFormat.HYPHEN_yyyy_MM_dd,
            fromDate: filter?.startDate
              ? dfns.format(filter.startDate, DateFormat.HYPHEN_yyyy_MM_dd)
              : undefined,
            toDate: filter?.endDate
              ? dfns.format(filter?.endDate, DateFormat.HYPHEN_yyyy_MM_dd)
              : undefined,
          },
        }),
        [
          mainWallet?.walletId,
          filter.limit,
          filter.pageIndex,
          debouncedSearchQ,
          filter,
        ]
      ),
      { skip: !mainWallet?.walletId }
    );

  const transactionSections = (() => {
    const transactions = Object.values(infiniteTransactions).flatMap(
      (transactions) => transactions
    );

    const groupedTransactions = transactions?.reduce(
      (acc, curr) => {
        // const key = curr.transaction_date;
        const key = dfns.startOfMonth(curr.transaction_date).toString();

        if (acc[key]) {
          acc[key].transactions.push(curr);
        } else {
          acc[key] = {
            date: key,
            transactions: [curr],
          };
        }

        return acc;
      },
      {} as { [x: string]: TransactionSection }
    );

    if (!groupedTransactions) {
      return [];
    }

    return Object.values(groupedTransactions);
  })();

  const topItemIntersectionObserver = useIntersectionObserver((entries) => {
    if (transactionSavingsHistoryQueryResult.isFetching) return;

    if (
      !noPagination &&
      entries[0].isIntersecting &&
      (transactionSavingsHistoryQueryResult.isUninitialized ||
        transactionSavingsHistoryQueryResult.data?.data?.length)
      // Math.ceil(pageState.offset / pageState.limit) + 1 <
      //   transactionsQueryResult.data?.data?.pageCount
    ) {
      setFilter((p) => ({ ...p, pageIndex: p.pageIndex + 1 }));
    }
  });

  const observerRef = useRef(topItemIntersectionObserver);

  const lastItemRefCallback = useCallback((node: HTMLDivElement) => {
    observerRef.current.disconnect();
    if (node) {
      observerRef.current.observe(node);
    }
  }, []);

  const virtualizer = useVirtualizer({
    count: transactionSections?.length,
    getScrollElement: () => transactionsParentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const dataRef = useDataRef({ debouncedSearchQ });

  useEffect(() => {
    if (
      transactionSavingsHistoryQueryResult.originalArgs &&
      !transactionSavingsHistoryQueryResult.isFetching
    ) {
      setInfiniteTransactions((p) => ({
        ...p,
        [JSON.stringify(transactionSavingsHistoryQueryResult.originalArgs)]:
          transactionSavingsHistoryQueryResult.data?.data ?? [],
      }));
    }
  }, [
    dataRef,
    transactionSavingsHistoryQueryResult.isFetching,
    transactionSavingsHistoryQueryResult.originalArgs,
    transactionSavingsHistoryQueryResult.data?.data,
  ]);

  const isLoading =
    transferWalletsQueryResult.isLoading ||
    transactionSavingsHistoryQueryResult.isLoading;
  const isError =
    transferWalletsQueryResult.isError ||
    transactionSavingsHistoryQueryResult.isError;

  const handleRefetch = () => {
    if (transferWalletsQueryResult.isError) {
      transferWalletsQueryResult.refetch();
    }

    if (transactionSavingsHistoryQueryResult.isError) {
      transactionSavingsHistoryQueryResult.refetch();
    }
  };

  return (
    <>
      <div className="space-y-4">
        {!hideFilter ? (
          <>
            <div className="flex items-center py-1">
              <SearchTextField
                placeholder="Search for account name, account number"
                className="w-full max-w-md"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
              <div className="flex-1" />
              <TransactionFilter filter={filter} onFilterApply={setFilter}>
                {({ toggleOpen }) => (
                  <Button
                    className="min-w-[100px]"
                    color="inherit"
                    variant="outlined"
                    size="small"
                    startIcon={
                      <Icon>
                        <Iconify icon="tabler:filter" />
                      </Icon>
                    }
                    onClick={toggleOpen}
                  >
                    Filter
                  </Button>
                )}
              </TransactionFilter>
            </div>
          </>
        ) : null}

        <div>
          <LoadingContent
            loading={isLoading}
            error={isError}
            onRetry={handleRefetch}
          >
            {() => (
              <>
                {transactionSections?.length ? (
                  <div
                    className="overflow-y-auto h-[calc(100vh-400px)]"
                    style={{ contain: "strict" }}
                    ref={transactionsParentRef}
                  >
                    <div
                      className="relative w-full"
                      style={{
                        height: virtualizer.getTotalSize(),
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 w-full space-y-8"
                        style={{
                          transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                        }}
                      >
                        {virtualItems.map((virtualItem) => {
                          const transactionSection =
                            transactionSections?.[virtualItem.index];
                          return (
                            <div
                              key={transactionSection?.date}
                              data-index={virtualItem.index}
                              ref={virtualizer.measureElement}
                            >
                              <TransactionListSection
                                key={transactionSection?.date}
                                section={transactionSection}
                              />
                            </div>
                          );
                        })}
                        <div ref={lastItemRefCallback} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-y-8 my-8">
                    <Iconify icon="ph:empty-duotone" fontSize={50} />
                    <div>
                      <Typography
                        variant="h6"
                        className="text-center"
                        gutterBottom
                      >
                        No Transactions
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        className="text-center"
                      >
                        You don’t have any transaction history yet.
                      </Typography>
                    </div>
                  </div>
                )}
              </>
            )}
          </LoadingContent>
        </div>
      </div>
    </>
  );
}

export const Component = TransactionList;

export default TransactionList;

export type TransactionListProps = {
  hideFilter?: boolean;
  noPagination?: boolean;
};
