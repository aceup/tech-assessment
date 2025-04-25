import { useState } from 'react';
import NewOrderDialog from './NewOrderDialog';

function NewOrderButton({ onOrderCreated }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Order
      </button>

      <NewOrderDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        onOrderCreated={onOrderCreated}
      />
    </>
  );
}

export default NewOrderButton;