import { useEffect } from "react";
import "./LoadingContent.css";
import ErrorContent from "./ErrorContent";
import LoadingIndicator from "./LoadingIndicator";
import useDataRef from "hooks/use-data-ref";
import { cn } from "utils/cn";

function LoadingContent(props: LoadingUIProps) {
  const {
    fullHeight,
    centered,
    onMount,
    Component,
    loading,
    renderLoading,
    error,
    renderError,
    blocking,
    renderBlocking,
    children,
    className,
    ...restProps
  } = props;
  const dataRef = useDataRef({ onMount });

  useEffect(() => {
    dataRef.current.onMount?.();
  }, [dataRef]);

  if (!loading && !error) {
    return typeof children === "function" ? children() : children;
  }

  return (
    <Component
      className={cn(
        "LoadingContent",
        className,
        fullHeight && "LoadingContent--fullHeight",
        centered && "LoadingContent--centered"
      )}
      {...restProps}
    >
      {blocking ? renderBlocking?.(props) : null}
      {error ? renderError?.(props) : renderLoading?.(props)}
    </Component>
  );
}

LoadingContent.defaultProps = {
  Component: "div",
  Loading: CustomLoading,
  renderLoading,
  Error: CustomError,
  renderError,
  Blocking: "div",
  renderBlocking,
};

export default LoadingContent;

function CustomLoading(props) {
  return (
    <div {...props}>
      <LoadingIndicator />
    </div>
  );
}

/**
 *
 * @param {LoadingUIProps} props
 */
function renderLoading(props) {
  const Loading = props.Loading;
  return (
    <Loading
      {...props.LoadingProps}
      className={cn("LoadingContent-loading", props.LoadingProps?.className)}
    />
  );
}

function CustomError(props) {
  return <ErrorContent {...props} />;
}

/**
 *
 * @param {LoadingUIProps} props
 */
function renderError(props) {
  const Error = props.Error;
  return (
    <Error
      onRetry={props.onRetry}
      {...props.ErrorProps}
      className={cn("LoadingContent-error", props.ErrorProps?.className)}
    />
  );
}

/**
 *
 * @param {LoadingUIProps} props
 */
function renderBlocking(props) {
  const Blocking = props.Blocking;
  return (
    <Blocking
      {...props.BlockingProps}
      className={cn("LoadingContent-blocking", props.BlockingProps?.className)}
    />
  );
}

type LoadingUIProps = {
  fullHeight?: boolean;
  centered?: boolean;
  Component?: any;
  children: any | (() => any);
  onMount?: () => void;
  loading?: boolean;
  LoadingProps?: any;
  renderLoading?: (props: LoadingUIProps) => React.ReactNode;
  error?: boolean;
  Error?: any;
  ErrorProps?: any;
  renderError?: (props: LoadingUIProps) => React.ReactNode;
  errorTitle?: React.ReactNode;
  errorDescription?: React.ReactNode;
  onRetry?: any;
  onCancel?: () => void;
  cancelText?: () => void;
  blocking?: boolean;
  Blocking?: any;
  BlockingProps?: any;
  renderBlocking?: (props: LoadingUIProps) => React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">;
