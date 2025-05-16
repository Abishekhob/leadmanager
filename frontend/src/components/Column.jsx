import { Droppable } from '@hello-pangea/dnd';
import LeadCard from './LeadCard';

export default function Column({
  status,
  leads,
  onLeadClick,
  selectedLeads,
  toggleLeadSelection
}) {
  console.log(`Rendering ${status} column with`, leads.length, 'leads');

  return (
    <div
      className="bg-light p-3 rounded shadow-sm d-flex flex-column"
      style={{
        minWidth: 250,
        height: '100%' // 👈 allow it to take full height of parent
      }}
    >
      <h5 className="text-center text-primary">{status.replace('_', ' ')}</h5>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="d-flex flex-column gap-2 flex-grow-1 overflow-auto"
            style={{
              minHeight: '200px',
              maxHeight: '100%', // 👈 restrict to container height
              backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : '',
              padding: '8px',
              borderRadius: '8px'
            }}
          >
            {leads.map((lead, index) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                index={index}
                onClick={() => onLeadClick(lead)}
                selectedLeads={selectedLeads}
                toggleLeadSelection={toggleLeadSelection}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
