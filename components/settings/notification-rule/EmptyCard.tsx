import React from "react";

const EmptyCard = () => {
  return (
    <div
      className={`
        rounded-lg border border-gray-300 py-8 text-center text-stone-500
        dark:border-gray-700 dark:text-gray-400
      `}
    >
      --空--
    </div>
  );
};

export default EmptyCard;
