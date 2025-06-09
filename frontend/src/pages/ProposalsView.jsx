import React from 'react';

const ProposalsView = ({
  view,
  role,
  sentProposals,
  receivedProposals,
  markComplete,
  uploadProposal,
  fixPath,
}) => {
  if (view !== 'proposals') return null;

   return (
    <div className="container mt-5">
      {/* USER Role */}
      {role === 'USER' && (
        <>
          <h3 className="mb-4 text-primary">📤 Proposals You Requested</h3>
          {sentProposals.length === 0 ? (
            <p className="text-muted fst-italic">No proposals sent yet.</p>
          ) : (
            sentProposals.map((p) => (
              <div key={p.id} className="card mb-4 shadow border">
                <div className="card-body">
                 

                  <p><strong>Sent to:</strong> {p.assignedToName || 'N/A'}</p>

                   <p><strong>Lead name:</strong> {p.leadName || 'N/A'}</p>

                  {p.notes && (
                    <p className="text-muted">📝 {p.notes}</p>
                  )}

                  {p.referenceFilePath && (
                    <div className="mb-2">
                      <strong>📎 Reference:</strong>{' '}
                      {/\.(jpg|jpeg|png|gif)$/i.test(p.referenceFilePath) ? (
                        <img
                          src={`http://localhost:8080/${fixPath(p.referenceFilePath)}`}
                          alt="Reference"
                          className="img-thumbnail mt-2"
                          style={{ maxWidth: '200px' }}
                        />
                      ) : (
                        <a
                          href={`http://localhost:8080/${fixPath(p.referenceFilePath)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="link-primary"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  )}

                  {p.proposalFilePath && (
                    <div className="mb-2">
                      <strong>📄 Uploaded Proposal:</strong>{' '}
                      <a
                        href={`http://localhost:8080/${fixPath(p.proposalFilePath)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="link-primary"
                      >
                        View Proposal
                      </a>
                    </div>
                  )}

                  {!p.completed && p.proposalFilePath && (
                    <button
                      onClick={() => markComplete(p.id)}
                      className="btn btn-success btn-sm mt-2"
                    >
                      ✅ Mark as Complete
                    </button>
                  )}

                  <p className="mt-3">
                    <strong>Status:</strong>{' '}
                    <span className={p.completed ? 'text-success' : 'text-warning'}>
                      {p.completed ? '✅ Completed' : '⏳ Pending'}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* PROPOSAL_CREATOR Role */}
      {role === 'PROPOSAL_CREATOR' && (
        <>
          <h3 className="mb-4 text-primary">📥 Proposals Assigned to You</h3>
          {receivedProposals.map((p) => (
            <div key={p.id} className="card mb-4 shadow border">
              <div className="card-body">
                <p>
                  📬 Proposal request from <strong>{p.requestedBy?.name || 'Someone'}</strong> on{' '}
                  <small className="text-muted">{new Date(p.createdAt).toLocaleString()}</small>
                </p>

                 <p><strong>Lead name:</strong> {p.leadName || 'N/A'}</p>
\begin{itemize}   
                {p.notes && <p className="text-muted">📝 {p.notes}</p>}

                {p.referenceFilePath && (
                  <div className="mb-2">
                    <strong>📎 Reference:</strong>{' '}
                    {/\.(jpg|jpeg|png|gif)$/i.test(p.referenceFilePath) ? (
                      <img
                        src={`http://localhost:8080/${fixPath(p.referenceFilePath)}`}
                        alt="Reference"
                        className="img-thumbnail mt-2"
                        style={{ maxWidth: '200px' }}
                      />
                    ) : (
                      <a
                        href={`http://localhost:8080/${fixPath(p.referenceFilePath)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="link-primary"
                      >
                        View File
                      </a>
                    )}
                  </div>
                )}

                {!p.proposalFilePath ? (
                  <form
                    onSubmit={(e) => uploadProposal(e, p.id)}
                    className="d-flex align-items-center gap-2 mt-3"
                  >
                    <input type="file" name="proposalFile" required className="form-control form-control-sm w-auto" />
                    <button type="submit" className="btn btn-primary btn-sm">
                      📤 Upload Proposal
                    </button>
                  </form>
                ) : (
                  <div className="mb-2">
                    <strong>📎 Uploaded Proposal:</strong>{' '}
                    {/\.(jpg|jpeg|png|gif)$/i.test(p.proposalFilePath) ? (
                      <img
                        src={`http://localhost:8080/${fixPath(p.proposalFilePath)}`}
                        alt="Proposal"
                        className="img-thumbnail mt-2"
                        style={{ maxWidth: '200px' }}
                      />
                    ) : (
                      <a
                        href={`http://localhost:8080/${fixPath(p.proposalFilePath)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="link-primary"
                      >
                        📄 View Uploaded Proposal
                      </a>
                    )}
                    {p.proposalUploadedAt && (
                      <p className="text-muted mt-1">
                        📅 Uploaded on: {new Date(p.proposalUploadedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                <p className="mt-3">
                  <strong>Status:</strong>{' '}
                  <span className={p.completed ? 'text-success' : 'text-warning'}>
                    {p.completed ? '✅ Completed' : '⏳ Pending'}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ProposalsView;