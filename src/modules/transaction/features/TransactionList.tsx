import { useVirtualizer } from "@tanstack/react-virtual";
import { transactionApi } from "apis/transaction.ts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoadingContent from "components/LoadingContent.tsx";
import { Transaction } from "types/transaction.ts";
import { PAGE_LIMIT } from "constants/pagination.ts";
import useIntersectionObserver from "hooks/use-intersection-observer.tsx";
import { TransactionSection } from "modules/transaction/types/transaction.ts";
import {
  Button,
  Icon,
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";
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
import { walletApi } from "apis/wallet";

function TransactionList(props: TransactionListProps) {
  const { hideFilter, noPagination, filter: propFilter } = props;

  const [pagination, setPagination] = useState(() => ({ pageIndex: 0 }));

  const [filter, setFilter] = useState(
    () =>
      ({
        // pageIndex: 0,
        limit: PAGE_LIMIT,
      }) as TransactionFilterState
  );

  const transactionsParentRef = useRef(null);

  const [infiniteTransactions, setInfiniteTransactions] = useState<{
    [x: string]: Transaction[];
  }>({});

  const [debouncedSearchQ, setSearchQ, searchQ] = useDebouncedState("", {
    wait: 500,
  });

  const transferWalletsQueryResult = walletApi.useGetWalletsQuery({});
  const transferWallets = transferWalletsQueryResult.data?.data;

  const mainWallet = transferWallets?.find((wallet) => !!wallet?.groupId);

  const transactionSavingsHistoryQueryResult =
    transactionApi.useGetTransactionSavingsHistoryQuery(
      useMemo(
        () => ({
          path: { savingsAccountId: mainWallet?.id },
          params: {
            page: pagination?.pageIndex + 1,
            limit: filter?.limit,
            accountNumber: debouncedSearchQ || undefined,
            accountName: debouncedSearchQ || undefined,
            transactionType: filter?.transactionType || undefined,
            dateFormat: DateFormat.HYPHEN_yyyy_MM_dd,
            fromDate: filter?.startDate
              ? dfns.format(filter.startDate, DateFormat.HYPHEN_yyyy_MM_dd)
              : undefined,
            toDate: filter?.endDate
              ? dfns.format(filter?.endDate, DateFormat.HYPHEN_yyyy_MM_dd)
              : undefined,
            minAmount: filter?.minimumAmount || undefined,
            maxAmount: filter?.maximumAmount || undefined,
          },
        }),
        [
          mainWallet?.id,
          // filter.limit,
          pagination.pageIndex,
          debouncedSearchQ,
          filter,
        ]
      ),
      { skip: !mainWallet?.id, refetchOnMountOrArgChange: true }
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
      setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }));
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

  useEffect(() => {
    if (propFilter) {
      setFilter((p) => ({ ...p, ...propFilter }));
    }
  }, [propFilter]);

  useEffect(() => {
    setInfiniteTransactions({});
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [filter, debouncedSearchQ]);

  const isLoading =
    transferWalletsQueryResult.isLoading ||
    transactionSavingsHistoryQueryResult.isLoading ||
    (transactionSavingsHistoryQueryResult.isFetching && !pagination.pageIndex);
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
          <div className="absolute top-0 left-0 right-0 z-10 bg-inherit ">
            <div>
              {transactionSavingsHistoryQueryResult.isFetching &&
              !transactionSavingsHistoryQueryResult.isLoading ? (
                <LinearProgress variant="indeterminate" />
              ) : (
                <div className="h-1" />
              )}
            </div>
          </div>
          <LoadingContent
            loading={isLoading}
            error={isError}
            onRetry={handleRefetch}
            renderLoading={() => <TransferRecentTransactionSkeleton />}
          >
            {() => (
              <>
                {transactionSections?.length ? (
                  <div
                    className="overflow-y-auto h-[calc(100vh-400px)] scrollbar-hidden"
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
  filter?: TransactionFilterState;
};

function TransferRecentTransactionSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 pt-[18px] w-full">
      {Array(5)
        .fill(5)
        .map(() => (
          <div className="flex items-center gap-1">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex flex-col flex-1 w-full gap-1">
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton
                variant="text"
                className="w-full max-w-[200px]"
                height={20}
              />
            </div>
            <Skeleton variant="text" width={100} height={20} />
          </div>
        ))}
    </div>
  );
}
