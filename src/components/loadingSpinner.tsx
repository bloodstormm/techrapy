const LoadingSpinner = ({mensagem}: {mensagem: string}) => (
    <div className="flex flex-col min-h-screen justify-center items-center gap-4">
      <div className="flex justify-center items-center">
        <div className="w-16 h-16 border-t-2 border-orange-900 dark:border-primary border-solid rounded-full animate-spin" />
      </div>
      <p className="text-center text-orange-900 dark:text-primary text-xl font-medium">
        {mensagem}
      </p>
    </div>
  );
  

export default LoadingSpinner;