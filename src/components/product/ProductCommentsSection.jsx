import { formatRelativeTime, formatFullDate } from "../../utils/dateFormat";

export default function ProductCommentsSection({
  comments,
  currentUser,
  product,
  newComment,
  replyToComment,
  commentError,
  isSubmittingComment,
  onNewCommentChange,
  onSubmitComment,
  onReply,
  onCancelReply,
  onDeleteComment,
}) {
  const topLevelComments = comments.filter((comment) => !comment.parentCommentId);
  const repliesByParentId = comments.reduce((acc, comment) => {
    if (!comment.parentCommentId) {
      return acc;
    }

    if (!acc[comment.parentCommentId]) {
      acc[comment.parentCommentId] = [];
    }

    acc[comment.parentCommentId].push(comment);
    return acc;
  }, {});

  return (
    <div id="comments-section" className="card border-0 shadow-sm rounded-4 mt-4">
      <div className="card-body p-4 p-md-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h5 fw-bold mb-0">
            <i className="bi bi-chat-left-text me-2"></i>
            Comentarios y Preguntas
          </h2>
          <span className="badge bg-secondary">{comments.length}</span>
        </div>

        <form onSubmit={onSubmitComment} className="mb-4">
          <div className="mb-3">
            <label className="form-label small fw-600">Escribe un comentario o pregunta</label>
            {replyToComment && (
              <div className="alert alert-info py-2 d-flex justify-content-between align-items-center mb-2">
                <span className="small mb-0">
                  Respondiendo a <strong>{replyToComment.username}</strong>
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none p-0"
                  onClick={onCancelReply}
                >
                  Cancelar
                </button>
              </div>
            )}
            <textarea
              className="form-control"
              rows="3"
              placeholder={
                replyToComment
                  ? `Escribe tu respuesta para ${replyToComment.username}...`
                  : "¿Tienes alguna pregunta sobre este producto?"
              }
              value={newComment}
              onChange={onNewCommentChange}
              maxLength={1000}
              required
            ></textarea>
            <div className="form-text text-end small">{newComment.length}/1000 caracteres</div>
          </div>
          {commentError && <div className="alert alert-danger py-2 mb-3">{commentError}</div>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmittingComment || !newComment.trim()}
          >
            {isSubmittingComment ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Publicando...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                {replyToComment ? "Publicar respuesta" : "Publicar comentario"}
              </>
            )}
          </button>
        </form>

        <hr className="my-4" />

        {comments.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-chat display-4 text-muted"></i>
            <p className="text-muted mt-3 mb-0">Aún no hay comentarios en este producto</p>
            <p className="text-muted small">¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {topLevelComments.map((comment) => {
              const replies = repliesByParentId[comment.id] || [];
              const isCommentOwner = currentUser?.id === comment.userId;
              const isProductOwner = currentUser?.id === product.ownerId;
              const userInitials = comment.username
                ? comment.username.slice(0, 2).toUpperCase()
                : "??";

              return (
                <div key={comment.id}>
                  <div className="d-flex gap-3 p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="flex-shrink-0">
                      {comment.userProfileImageUrl ? (
                        <img
                          src={comment.userProfileImageUrl}
                          alt={comment.username}
                          className="rounded-circle"
                          style={{ width: "48px", height: "48px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="rounded-circle align-items-center justify-content-center fw-bold text-white bg-secondary"
                        style={{
                          width: "48px",
                          height: "48px",
                          fontSize: "0.9rem",
                          display: comment.userProfileImageUrl ? "none" : "flex",
                        }}
                      >
                        {userInitials}
                      </div>
                    </div>

                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="fw-bold">{comment.username}</span>
                          {isProductOwner && comment.userId === product.ownerId && (
                            <span className="badge bg-primary ms-2" style={{ fontSize: "0.7rem" }}>
                              Vendedor
                            </span>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted small" title={formatFullDate(comment.createdAt)}>
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-link p-0 text-decoration-none"
                            onClick={() => onReply(comment)}
                          >
                            <i className="bi bi-reply me-1"></i>
                            Responder
                          </button>
                          {isCommentOwner && (
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger p-0"
                              onClick={() => onDeleteComment(comment.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>

                  {replies.length > 0 && (
                    <div className="ms-4 ms-md-5 mt-2 d-flex flex-column gap-2">
                      {replies.map((reply) => {
                        const isReplyOwner = currentUser?.id === reply.userId;
                        const replyInitials = reply.username
                          ? reply.username.slice(0, 2).toUpperCase()
                          : "??";

                        return (
                          <div
                            key={reply.id}
                            className="d-flex gap-2 p-3 rounded-3"
                            style={{
                              backgroundColor: "#eef3ff",
                              borderLeft: "3px solid #0d6efd",
                            }}
                          >
                            <div className="flex-shrink-0">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white bg-primary"
                                style={{ width: "38px", height: "38px", fontSize: "0.8rem" }}
                              >
                                {replyInitials}
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <span className="fw-bold small">{reply.username}</span>
                                <div className="d-flex align-items-center gap-2">
                                  <span
                                    className="text-muted small"
                                    title={formatFullDate(reply.createdAt)}
                                  >
                                    {formatRelativeTime(reply.createdAt)}
                                  </span>
                                  {isReplyOwner && (
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-link text-danger p-0"
                                      onClick={() => onDeleteComment(reply.id)}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="mb-0 small" style={{ whiteSpace: "pre-wrap" }}>
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
