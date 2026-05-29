import { useCallback, useEffect, useState } from 'react';
import * as catalogApi from '../api/catalog.api.js';
import { getApiErrorMessage } from '../utils/apiError.js';

export const useBooks = (initialFilters = {}) => {
    const [books, setBooks] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const controller = new AbortController();

        queueMicrotask(() => {
            if (!cancelled) setLoading(true);
            if (!cancelled) setError(null);
        });

        catalogApi.getBooks(filters, page, pagination.limit)
            .then(response => {
                if (cancelled) return;
                const booksList = response.data || [];
                setBooks(booksList);
                setPagination({
                    page: response.pagination?.page || page,
                    limit: response.pagination?.limit || pagination.limit,
                    total: response.pagination?.total || 0,
                });
            })
            .catch(fetchError => {
                if (cancelled) return;
                setError(getApiErrorMessage(fetchError, 'Error al cargar libros'));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [filters, page, pagination.limit, refreshKey]);

    const fetchBooks = useCallback(() => {
        setRefreshKey(k => k + 1);
    }, []);

    const updateFilters = (nextFilters) => {
        setFilters(nextFilters);
        setPage(1);
    };

    const deleteBook = async (id) => {
        setError(null);
        try {
            await catalogApi.deleteBook(id);
            fetchBooks();
        } catch (deleteError) {
            setError(getApiErrorMessage(deleteError, 'Error al eliminar libro'));
        }
    };

    const saveBook = async (book, id) => {
        setError(null);
        try {
            if (id) {
                await catalogApi.updateBook(id, book);
            } else {
                await catalogApi.createBook(book);
            }
            fetchBooks();
        } catch (saveError) {
            setError(getApiErrorMessage(saveError, 'Error al guardar libro'));
            throw saveError;
        }
    };

    return {
        books,
        filters,
        page,
        loading,
        error,
        pagination,
        updateFilters,
        setPage,
        fetchBooks,
        deleteBook,
        saveBook,
    };
};
