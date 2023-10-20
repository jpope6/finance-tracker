import React, { useState, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Modal from 'react-modal';

import { useUserBanks } from '../hooks/useBankData';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import '../styles/bank-table.css';
import '../styles/modal.css';

Modal.setAppElement("#root");

const BankTable = ({ bankName }) => {
    const gridRef = useRef();
    const [modalOpen, setModalOpen] = useState(false);
    const [fadeAway, setFadeAway] = useState(false);
    const [rowData, setRowData] = useState([
        { date: new Date("2023-10-19T00:00:00").toLocaleDateString() },
    ]);
    const { addBankEntry } = useUserBanks();
    const [date, setDate] = useState(new Date().toJSON().slice(0, 10));
    const [checkings, setCheckings] = useState(0);
    const [savings, setSavings] = useState(0);
    const [other, setOther] = useState(0);

    const columnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, maxWidth: 50 },
        { field: 'date', headerName: 'Date' },
        { field: 'checkings', headerName: 'Checkings' },
        { field: 'savings', headerName: 'Savings' },
        { field: 'other', headerName: 'Other' },
    ];

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 180,
            sortable: true,
            resizable: true,
            editable: true,
        };
    }, []);

    const addRow = () => {
        const copy = [...rowData];
        const newBank = { bank: 'Bank', checkings: '100', savings: '200' }
        copy.push(newBank);
        setRowData(copy);
    }

    const handleModalOpen = () => {
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setFadeAway(true);
        setTimeout(() => {
            setModalOpen(false);
            setFadeAway(false);
        }, 200);
    }

    const handleModalSubmit = async (e) => {
        e.preventDefault();

        try {
            await addBankEntry(
                bankName,
                date,
                checkings,
                savings,
                other
            );
            setModalOpen(false);
        } catch (error) {
            console.error("Error adding a bank:", error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'date') {
            setDate(value);
        } else if (name === 'checkings') {
            setCheckings(parseFloat(value).toFixed(2));
        } else if (name === 'savings') {
            setSavings(parseFloat(value).toFixed(2));
        } else if (name === 'other') {
            setOther(parseFloat(value).toFixed(2));
        }
    }

    return (
        <div className="ag-theme-alpine-dark"
            style={{ width: '100%', paddingTop: '2rem' }}>
            <button onClick={handleModalOpen}>Add Entry</button>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                rowSelection='multiple'
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                domLayout='autoHeight'
            />

            <Modal
                isOpen={modalOpen}
                className={`modal ${fadeAway ? "fade-away" : ""}`}
                style={{
                    overlay: {
                        background: "rgba(0, 0, 0, 0.7)",
                    },
                }}
            >

                <div className="modal-header">
                    <button className="close-button" onClick={handleModalClose}>
                        X
                    </button>
                </div>

                <div className="input-container">
                    <label htmlFor="date-input">Date:</label>
                    <input type="date" name='date' id="date-input" value={date} onChange={handleInputChange} />
                </div>

                <div className="input-container">
                    <label htmlFor="checkings-input">Checkings:</label>
                    <input type="number" name='checkings' id="checkings-input" onChange={handleInputChange} />
                </div>

                <div className="input-container">
                    <label htmlFor="savings-input">Savings:</label>
                    <input type="number" name='savings' id="savings-input" onChange={handleInputChange} />
                </div>

                <div className="input-container">
                    <label htmlFor="other-input">Other:</label>
                    <input type="number" name='other' id="other-input" onChange={handleInputChange} />
                </div>
                <button className="modal-button" onClick={handleModalSubmit}>Add Entry</button>
            </Modal>
        </div>
    );
};

export default BankTable;
