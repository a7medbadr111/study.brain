export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-secondary"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin-slow"></div>
      </div>
      <p className="text-muted-foreground animate-pulse text-lg">جاري التحليل...</p>
    </div>
  );
};
