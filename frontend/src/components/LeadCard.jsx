import { Draggable } from '@hello-pangea/dnd';

export default function LeadCard({ lead, index, onClick, selectedLeads, toggleLeadSelection }) {
  return (
    <Draggable draggableId={lead.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className="card p-2"
          style={{
            ...provided.draggableProps.style,
            userSelect: 'none',
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            boxShadow: snapshot.isDragging ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
            background: 'white',
            borderRadius: '8px',
            position: 'relative',
          }}
        >
          {/* Checkbox */}
          {!lead.assignedTo && (
            <input
              type="checkbox"
              checked={selectedLeads.includes(lead.id)}
              onChange={() => toggleLeadSelection(lead.id)}
              style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 2 }}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {/* Category Badge */}
          {lead.category && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor:
                  lead.category.toLowerCase() === 'hot'
                    ? '#e63946'
                    : lead.category.toLowerCase() === 'warm'
                    ? '#f4a261'
                    : '#457b9d',
                color: 'white',
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 'bold',
                zIndex: 1,
              }}
            >
              {lead.category}
            </div>
          )}

          {/* Lead Info */}
          <strong>{lead.name}</strong>
          <div className="text-muted">{lead.email}</div>
        </div>
      )}
    </Draggable>
  );
}
