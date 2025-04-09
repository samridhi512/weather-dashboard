import React from "react";

const RecentSearches = ({ searches, onSelect }) => {
  return (
    <div className="mt-4 mb-6">
      <p className="text-sm mb-2">Recent searches:</p>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSelect(search)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm transition-colors"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
