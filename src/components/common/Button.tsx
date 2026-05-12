const Button = ({ content }: { content: string }) => {
  return (
    <button className=" bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:scale-105 transition-all duration-300">
      {content}
    </button>
  );
};

export default Button;
