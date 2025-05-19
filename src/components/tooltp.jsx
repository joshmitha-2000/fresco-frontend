import React from 'react';

function Tooltip({ message = 'hello', children, visible }) {
  return (
    <div className="relative inline-block">
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-sm font-semibold rounded shadow-lg whitespace-nowrap z-10">
          {message}
        </div>
      )}
      {children}
    </div>
  );
}

export default Tooltip;