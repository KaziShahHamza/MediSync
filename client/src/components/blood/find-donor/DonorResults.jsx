// client/src/components/blood/DonorResults.jsx

// Renders paginated donor search results after a search has been performed.
// Handles populated results, compact pagination controls, and the no-match state.

import { ChevronLeft, ChevronRight, Droplets } from "lucide-react";

import DonorResultItem from "./DonorResultItem";

// Builds a compact list of page numbers and ellipsis markers.
function getPaginationItems(currentPage, totalPages) {
  const pages = [];

  // Display every page when the total number of pages is small.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Always show the first page.
  pages.push(1);

  // Show the pages around the current page.
  if (currentPage <= 4) {
    pages.push(2, 3, 4, 5);

    pages.push("ellipsis-right");

    pages.push(totalPages);

    return pages;
  }

  // Show the last pages when the current page is near the end.
  if (currentPage >= totalPages - 3) {
    pages.push("ellipsis-left");

    pages.push(
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );

    return pages;
  }

  // Show a compact range around the current page.
  pages.push("ellipsis-left");

  pages.push(currentPage - 1, currentPage, currentPage + 1);

  pages.push("ellipsis-right");

  pages.push(totalPages);

  return pages;
}

export default function DonorResults({
  donors,
  totalDonors,
  searched,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
}) {
  // Hide the result section until a completed search can be displayed.
  if (!searched || loading || error) {
    return null;
  }

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <section>
      {/* Render the result heading and total matching donor count. */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="section-title text-xl">Available Donors</h2>

          <p className="text-sm text-muted mt-1">
            {totalDonors} donor
            {totalDonors !== 1 ? "s" : ""} found.
          </p>
        </div>
      </div>

      {/* Switch between matching donor results and the empty state. */}
      {totalDonors > 0 ? (
        <>
          <div className="card overflow-hidden">
            <div className="hidden md:grid md:grid-cols-[1.2fr_1.5fr_1.5fr_1.2fr] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
              <p className="small-label">Blood Group</p>

              <p className="small-label">District</p>

              <p className="small-label">Upazila</p>

              <p className="small-label text-right">Contact</p>
            </div>

            {/* Render the donors returned for the current page. */}
            <div className="divide-y divide-slate-200">
              {donors.map((donor, index) => (
                <DonorResultItem
                  key={`${donor.bloodGroup}-${donor.district}-${donor.upazila}-${index}`}
                  donor={donor}
                />
              ))}
            </div>
          </div>

          {/* Render compact pagination controls when multiple pages exist. */}
          {totalPages > 1 && (
            <nav
              className="flex flex-wrap items-center justify-center gap-2 mt-6"
              aria-label="Donor results pagination"
            >
              {/* Previous page button. */}
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

              {/* Compact page number controls. */}
              <div className="flex items-center gap-1">
                {paginationItems.map((item, index) => {
                  // Render an ellipsis without making it interactive.
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
                      aria-current={currentPage === item ? "page" : undefined}
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

              {/* Next page button. */}
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
            <Droplets size={22} />
          </div>

          <h3 className="empty-state-title">No donors found</h3>

          <p className="empty-state-description">
            No available donors match your selected blood group, location, and
            compensation preference.
          </p>
        </div>
      )}
    </section>
  );
}
