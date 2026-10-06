// Renders the active blood request collection and its surrounding states.
// Handles loading, populated, empty, and paginated request views.

import { ChevronLeft, ChevronRight, Droplets } from "lucide-react";

import BloodRequestItem from "./BloodRequestItem";

// Builds a compact list of page numbers and ellipsis markers.
function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];

  if (currentPage <= 4) {
    pages.push(2, 3, 4, 5, "ellipsis-right", totalPages);

    return pages;
  }

  if (currentPage >= totalPages - 3) {
    pages.push(
      "ellipsis-left",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );

    return pages;
  }

  pages.push(
    "ellipsis-left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPages,
  );

  return pages;
}

export default function BloodRequestList({
  requests,
  loading,
  onEdit,
  onDelete,
  user,
  onCreate,
  currentPage = 1,
  totalPages = 1,
  totalRequests = 0,
  onPageChange,
}) {
  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <section className="mb-10">
      <div className="section-header">
        <div>
          <h2 className="section-title">Blood Requests</h2>

          <p className="text-sm text-muted mt-1">
            Active requests from people who currently need blood.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-muted">Loading blood requests...</p>
        </div>
      ) : requests.length > 0 ? (
        <>
          <div className="table-container">
            <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_1.5fr_1.8fr_1fr_1fr] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
              <p className="small-label">Blood</p>
              <p className="small-label">Bags</p>
              <p className="small-label">Location</p>
              <p className="small-label">Hospital</p>
              <p className="small-label">Posted</p>
              <p className="small-label text-right">Contact</p>
            </div>

            <div className="divide-y divide-slate-200">
              {requests.map((request) => (
                <BloodRequestItem
                  key={request.id}
                  request={request}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>

          {totalRequests > 0 && totalPages > 1 && (
            <nav
              className="flex flex-wrap items-center justify-center gap-2 mt-6"
              aria-label="Blood request pagination"
            >
              <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary"
                aria-label="Go to previous page"
              >
                <ChevronLeft size={17} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {paginationItems.map((item, index) => {
                  if (typeof item === "string") {
                    return (
                      <span
                        key={`${item}-${index}`}
                        className="flex h-10 min-w-8 items-center justify-center px-1 text-sm text-muted"
                        aria-hidden="true"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onPageChange(item)}
                      aria-current={
                        currentPage === item ? "page" : undefined
                      }
                      aria-label={`Go to page ${item}`}
                      className={
                        currentPage === item
                          ? "btn-primary min-w-10 justify-center"
                          : "btn-secondary min-w-10 justify-center"
                      }
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-secondary"
                aria-label="Go to next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={17} />
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Droplets size={25} />
          </div>

          <h3 className="empty-state-title">No active blood requests</h3>

          <p className="empty-state-description">
            If someone needs blood, you can post a request and let donors know.
          </p>

          <div className="empty-state-actions">
            <button type="button" onClick={onCreate} className="btn-primary">
              Post Blood Request
            </button>
          </div>
        </div>
      )}
    </section>
  );
}