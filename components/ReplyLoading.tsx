export function ReplyLoading() {
  return (
    <div className="flex items-center space-x-1.5 p-1">
      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-0"></div>
      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-150"></div>
      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-300"></div>
    </div>
  );
}
