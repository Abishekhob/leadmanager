import { Pagination } from 'react-bootstrap';

function BootstrapPagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    const pages = [];
    const visiblePages = 2;

    pages.push(
      <Pagination.First
        key="first"
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
      >
        First
      </Pagination.First>
    );
    pages.push(
      <Pagination.Prev
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Prev
      </Pagination.Prev>
    );

    if (currentPage > visiblePages) {
      pages.push(
        <Pagination.Item disabled key="start-ellipsis">
          ...
        </Pagination.Item>
      );
    }

    for (
      let i = Math.max(0, currentPage - visiblePages);
      i <= Math.min(totalPages - 1, currentPage + visiblePages);
      i++
    ) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i + 1}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages - visiblePages - 1) {
      pages.push(
        <Pagination.Item disabled key="end-ellipsis">
          ...
        </Pagination.Item>
      );
    }

    pages.push(
      <Pagination.Next
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Next
      </Pagination.Next>
    );
    pages.push(
      <Pagination.Last
        key="last"
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage === totalPages - 1}
      >
        Last
      </Pagination.Last>
    );

    return pages;
  };

  return <Pagination>{getPages()}</Pagination>;
}

export default BootstrapPagination;
