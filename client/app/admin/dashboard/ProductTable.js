"use client";

import DataTable from "react-data-table-component";
import styles from "./page.module.css";

export default function ProductTable({
    columns,
    products,
    totalRows,
    perPage,
    setPage,
    setPerPage,
}) {
    return (
        <div className={styles.tableWrapper}>
            <DataTable
                columns={columns}
                data={products}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={perPage}
                onChangePage={(page) => setPage(page)}
                onChangeRowsPerPage={(newPerPage, page) => {
                    setPerPage(newPerPage);
                    setPage(page);
                }}
                highlightOnHover
                striped
                responsive
                fixedHeader
                fixedHeaderScrollHeight="580px"
                colorMode="dark"
            />
        </div>
    );
}