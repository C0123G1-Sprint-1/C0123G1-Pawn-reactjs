import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Modal} from 'react-bootstrap';
import * as redeemingService from '../../service/RedeemingService'
import {Field, Form, Formik, isNaN} from "formik";
import * as Swal from "sweetalert2";
import moment from "moment";
import {Link, useNavigate} from "react-router-dom";


export const Redeeming = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [contractCode, setContractCode] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [productName, setProductName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [contracts, setContract] = useState([]);
    const [selectedContract, setSelectedContract] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang

    const getToday = () => {
        const today = new Date();
        // Đặt giờ, phút, giây và mili giây về 0 để so sánh ngày mà không tính đến thời gian.
        today.setHours(0, 0, 0, 0);
        return today;
    };
    const handleModalClose = () => {
        setShowModal(false);
        setStartDate('')
        setCustomerName('')
        setContractCode('')
        setProductName('')

    };

    const handleModalOpen = () => {
        setPage(0)
        setShowModal(true);
        fetchContract()
    };


    const paginate = (page) => {

        setPage(page)


    }


    const fetchContract = async () => {
        try {
            const response = await redeemingService.getContractList(page, contractCode, customerName, productName, startDate)
            console.log(customerName)
            // setContract(getContract)
            console.log('API response:', response);
            await setContract(response.content)
            await setTotalPages(response.totalPages)
        } catch (error) {
            console.log('Error fetching contracts:', error);
        }
        console.log(contracts)
        console.log('seletedID:', setSelectedContract);


    }

    useEffect(() => {

        fetchContract()
        console.log("trang so " + page)
    }, [page, contractCode, customerName, productName, startDate, setSelectedContract])

    // const handleContractSelect = (contract) => {
    //     setSelectedContract(contract);
    //     handleModalClose();
    // };
    console.log('Contracts:', contracts);


    const reset = async () => {

        setSelectedContract(0)

        // window.location.reload(false);
    }
    const loadContracts = async () => {


        Swal.fire({
            html: '<div className="loading-screen" style={{position: "fixed",\n' +
                '  top: "0;",\n' +
                '  left: "0",\n' +
                '  width: "100%",\n' +
                '  height: "100%",\n' +
                '  background-color: "rgba(0, 0, 0, 0.5)" }}/* Màu nền màn hình đen với độ mờ */></div>', // Sử dụng CSS để tạo màn hình đen.
            timer: 5000,
            title: "Vui lòng đợi chúng tôi xử lí trong vòng vài giây",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                await Swal.showLoading();
            },
            willClose: () => {
                // Thêm xử lý khi SweetAlert2 đóng (nếu cần thiết).
            }
        });
    };
    useEffect(()=>{
        window.scrollTo(0,0)
    },[])

    return (

        <>
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"/>
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"/>
            <meta charSet="UTF-8"/>
            <title>Title</title>
            {/*<link*/}
            {/*    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"*/}
            {/*    rel="stylesheet"*/}
            {/*    integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"*/}
            {/*    crossOrigin="anonymous"*/}
            {/*/>*/}
            {/*<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>*/}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
            />
            <style
                dangerouslySetInnerHTML={{


                    __html:
                        '\n        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap");\n\n       .card {\n            border: none;\n            padding: 20px;\n            position: relative;\n            background-color: rgba(255, 255, 255, 0.7);\n            border-radius: 20px;\n        }\n\n        body {\n        }\n\n        body {\n            background-color: #eee;\n            font-family: "Poppins", sans-serif;\n            font-weight: 300\n        }\n\n        .height {\n            height: 100vh\n        }\n\n        .card {\n            border: none;\n            padding: 20px;\n            position: relative\n        }\n\n        .btn-group {\n            display: flex;\n            justify-content: space-between;\n        }\n\n        label {\n            font-family: Arial, sans-serif;\n            font-size: 14px;\n            font-weight: bold;\n            color: #222222;\n            margin-bottom: 5px;\n            display: inline-block;\n        }\n\n    '
                }}
            />
            <br/>
            {/*style={{position: "fixed",*/}
            {/*left: "50%",*/}
            {/*top: "50%",*/}
            {/*transform: "translate(-50%, -50%)",*/}
            {/*paddingRight: "20px"}}*/}
            <div className="container pt-3 pb-5">
                <div className="row height d-flex justify-content-center align-items-center" style={{height: "85vh"}}>
                    <div className="col-md-6">
                        <div className="card px-5 py-4" style={{borderRadius: "7px",border: "1px solid rgba(0,0,0,0.17)"}}>
                            <div style={{textAlign: "center"}}>
                                <h1>
                                    TRẢ ĐỒ
                                </h1>
                            </div>

                            <div className="text-center mt-4 btn-group p-3 m-l-2">
                                <div className="text-center m-auto">
                                    <button
                                        type="button"
                                        className="btn btn-outline-success"

                                        onClick={() => {
                                            handleModalOpen()
                                        }}
                                    >
                                        <b className="text-center">Chọn hợp đồng</b>
                                    </button>
                                    <Modal
                                        className="modal-xl modal-dialog-centered align-content-center"
                                        show={showModal}
                                        onHide={handleModalClose}
                                        backdrop="static"
                                        keyboard={false}
                                        centered
                                        style={{
                                            position: "fixed",
                                            left: "50%",
                                            top: "50%",
                                            transform: "translate(-50%, -50%)",
                                            paddingRight: "20px"
                                        }}

                                    >
                                        <Modal.Header style={{backgroundColor: "#00833e", color: "white"}}>
                                            <Modal.Title style={{width: "100%", textAlign: "center"}}>
                                                <b>Chọn Hợp Đồng</b>
                                            </Modal.Title>
                                            <Button
                                                variant="secondary"
                                                className="btn-close"
                                                style={{marginLeft: 0}}
                                                onClick={handleModalClose}
                                            />
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="controls">
                                                <Formik initialValues={{
                                                    contractCode: contractCode,
                                                    customerName: customerName,
                                                    startDate: startDate,
                                                    productName: startDate
                                                }} onSubmit={(values) => {
                                                    const res = async () => {
                                                        await setContractCode(values.contractCode)
                                                        await setCustomerName(values.customerName)
                                                        await setProductName(values.productName)
                                                        await setStartDate(values.startDate)
                                                        await setPage(0)
                                                        await redeemingService.getContractList(page, contractCode, customerName, productName, startDate)
                                                    }
                                                    res()
                                                    fetchContract()

                                                }}>
                                                    <Form>
                                                        <div className="row">
                                                            <div className="col-lg-2">
                                                                <div className="form-group">
                                                                    <label style={{fontWeight: 500}} htmlFor="ma">Mã hợp đồng</label>
                                                                    <Field id="ma"
                                                                           type="text" name="contractCode"
                                                                           className="form-control"/>

                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="form-group">
                                                                    <label style={{fontWeight: 500}} htmlFor="kh">Tên khách hàng</label>
                                                                    <Field id="kh"
                                                                           type="text" name="customerName"
                                                                           className="form-control"/>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="form-group">
                                                                    <label style={{fontWeight: 500}} htmlFor="doCam">Đồ cầm</label>
                                                                    <Field id="doCam"
                                                                           type="text" name="productName"
                                                                           className="form-control"/>

                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="form-group">
                                                                    <label style={{fontWeight: 500}} htmlFor="dateStart">Ngày làm hợp
                                                                        đồng</label>
                                                                    <Field
                                                                        id="dateStart" type="date" name="startDate"
                                                                        className="form-control"/>
                                                                </div>

                                                            </div>
                                                            <div className="col-lg-1 d-flex justify-content-end">
                                                                <button type="submit"
                                                                        className="btn btn-outline-success "
                                                                        style={{width: "auto",height: "37px",marginTop: "3.7vh"}}><i
                                                                    className="bi bi-search"></i>
                                                                </button>

                                                            </div>

                                                        </div>

                                                    </Form>

                                                </Formik>
                                            </div>
                                            <table className="table table-striped">
                                                <thead>
                                                <tr style={{textAlign: "start"}}>
                                                    <th >Mã HĐ</th>
                                                    <th >Khách Hàng</th>
                                                    <th >Đồ Cầm</th>
                                                    <th >Tiền Cho Vay (VNĐ)</th>
                                                    <th >Ngày Làm HĐ</th>
                                                    <th >Chức Năng</th>
                                                </tr>
                                                </thead>

                                                {
                                                    contracts.length === 0 ?
                                                        <tr>
                                                            <td colSpan="6" className="text-center">
                                                                <h4 style={{color: "red"}}>Dữ liệu không tồn tại</h4>
                                                            </td>
                                                        </tr>
                                                        :
                                                        <tbody>

                                                        {
                                                            contracts.map((contract) => (
                                                                <tr key={contract.contractId} style={{textAlign: "start"}}>
                                                                    <td >HD-{contract.contractCode}</td>
                                                                    <td>{contract.customerName}</td>
                                                                    <td >{contract.productName}</td>
                                                                    <td >{contract.loans.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
                                                                    <td >{moment(contract.startDate, 'YYYY/MM/DD').format('DD/MM/YYYY')}</td>
                                                                    <td >
                                                                        <button onClick={() => {
                                                                            handleModalClose(true);
                                                                            setSelectedContract(contract.contractId)
                                                                        }} className="btn btn-success text-center">
                                                                            Chọn
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }


                                                        {/* Other table rows */}
                                                        </tbody>

                                                }


                                                {/* Other table rows */}
                                            </table>
                                            {
                                                contracts.length === 0 ? '' :
                                                    <div className="d-flex col-12 justify-content-end">
                                                        <nav aria-label="...">
                                                            <ul className="pagination">
                                                                <li hidden={page === 0} className="page-item ">
                                                                    <button className="page-link page-link-khanhh" tabIndex={-1}
                                                                            style={{border: "1px solid gray", borderRadius: "5px"}}

                                                                            onClick={() => paginate(page - 1)}>
                                                                        Trước
                                                                    </button>
                                                                </li>


                                                                {
                                                                    Array.from({length: totalPages}, (a, index) => index).map((pageNum) => (
                                                                        <li className="page-item">
                                                                            <button
                                                                                className={page === pageNum ? "page-link-active" : "page-link-khanh"}
                                                                                style={{border: "1px solid gray", borderRadius: "5px"}}
                                                                                key={pageNum}
                                                                                onClick={() => paginate(pageNum)}>
                                                                                {pageNum + 1}
                                                                            </button>
                                                                        </li>
                                                                    ))
                                                                }

                                                                <li hidden={page + 1 === totalPages}
                                                                    className="page-item">
                                                                    <button className="page-link page-link-khanhh" tabIndex={-1}
                                                                            style={{border: "1px solid gray", borderRadius: "5px"}}

                                                                            onClick={() => paginate(page + 1)}>
                                                                        Sau
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </div>
                                            }
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            </div>

                            <Formik initialValues={{}}


                                    onSubmit={async (value) => {
                                        const res = async () => {
                                            try {
                                                await redeemingService.redeem(selectedContract);

                                            } catch (e) {
                                                console.log(e)
                                            }
                                        }

                                       await loadContracts()
                                       await res()

                                        Swal.fire({
                                            icon:"success",
                                            title:"Trả đồ thành công",
                                            timer:2000
                                        })
                                        navigate('/nav/info-store/all-contract')


                                        reset()
                                        fetchContract()
                                    }}>


                                        <>
                                            <Form>
                                                <div className="row mt-2  ">
                                                    <div className="col-lg-6 inputs form-group">
                                                        <label style={{fontWeight: 500}}>Mã HĐ</label>

                                                        <h5 style={{
                                                            border: "0px solid gray",
                                                            alignItems: "center",
                                                            display: "flex",
                                                            backgroundColor: "#e9ecef",
                                                            height: "4.9vh",
                                                            borderRadius: "7px"
                                                        }}
                                                            className="p-0 m-0">
                                                            {contracts.find((c) => c.contractId == selectedContract)?.contractCode}
                                                        </h5>
                                                    </div>
                                                    <div className="col-lg-6 inputs form-group">
                                                        <label style={{fontWeight: 500}}>Tên khách hàng</label>

                                                        <h5 style={{
                                                            border: "0px solid gray",
                                                            alignItems: "center",
                                                            display: "flex",
                                                            backgroundColor: "#e9ecef",
                                                            height: "4.9vh",
                                                            borderRadius: "7px"
                                                        }}
                                                            className="p-0 m-0">
                                                            {contracts.find((c) => c.contractId == selectedContract)?.customerName}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="mt-2 inputs form-group">
                                                    <label style={{fontWeight: 500}}>Đồ cầm</label>

                                                    <h5 style={{
                                                        border: "0px solid gray",
                                                        alignItems: "center",
                                                        display: "flex",
                                                        backgroundColor: "#e9ecef",
                                                        height: "4.9vh",
                                                        borderRadius: "7px"
                                                    }}
                                                        className="p-0 m-0">
                                                        {contracts.find((c) => c.contractId == selectedContract)?.productName}
                                                    </h5>
                                                </div>
                                                <div className="row mt-2  ">
                                                    <div className="col-lg-6 inputs ">
                                                        <label style={{fontWeight: 500}}>Tiền cho vay (VNĐ)</label>
                                                        <h5 style={{
                                                            border: "0px solid gray",
                                                            alignItems: "center",
                                                            display: "flex",
                                                            backgroundColor: "#e9ecef",
                                                            height: "4.9vh",
                                                            borderRadius: "7px"
                                                        }}
                                                            className="p-0 m-0">
                                                            {contracts.find((c) => c.contractId == selectedContract)?.loans.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                                        </h5>
                                                    </div>
                                                    <div className="col-lg-6 inputs form-group">
                                                        <label style={{fontWeight: 500}}>Tiền lãi (VNĐ)</label>

                                                        <h5 style={{
                                                            border: "0px solid gray",
                                                            alignItems: "center",
                                                            display: "flex",
                                                            backgroundColor: "#e9ecef",
                                                            height: "4.9vh",
                                                            borderRadius: "7px"
                                                        }}
                                                            className="p-0 m-0">
                                                            {contracts.find((c) => c.contractId == selectedContract)?.profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row mt-2  ">
                                                    <div className="col-lg-6 inputs form-group">
                                                        <label style={{fontWeight: 500}}>Ngày bắt đầu</label>

                                                        <h5 style={{
                                                            border: "0px solid gray",
                                                            alignItems: "center",
                                                            display: "flex",
                                                            backgroundColor: "#e9ecef",
                                                            height: "4.9vh",
                                                            borderRadius: "7px"
                                                        }}
                                                            className="p-0 m-0">
                                                            {selectedContract ? moment(contracts.find((c) => c.contractId == selectedContract)?.startDate, 'YYYY/MM/DD').format('DD/MM/YYYY') : ''}
                                                        </h5>

                                                    </div>
                                                    <div className="col-lg-6 inputs form-group">
                                                        <label style={{fontWeight: 500}}>Ngày kết thúc</label>

                                                        <h5 style={{
                                                            border: "0px solid gray",
                                                            alignItems: "center",
                                                            display: "flex",
                                                            backgroundColor: "#e9ecef",
                                                            height: "4.9vh",
                                                            borderRadius: "7px"
                                                        }}
                                                            className="p-0 m-0">
                                                            {selectedContract ? moment(contracts.find((c) => c.contractId == selectedContract)?.endDate, 'YYYY/MM/DD').format('DD/MM/YYYY') : ''}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="mt-2 inputs">
                                                    <label style={{fontWeight: 500}}>Tiền thanh toán (VNĐ)</label>
                                                    <h5 style={{
                                                        border: "0px solid gray",
                                                        alignItems: "center",
                                                        display: "flex",
                                                        backgroundColor: "#e9ecef",
                                                        height: "4.9vh",
                                                        borderRadius: "7px"
                                                    }}
                                                        className="p-0 m-0">

                                                        {isNaN(contracts.find((c) => c.contractId == selectedContract)?.loans + contracts.find((c) => c.contractId == selectedContract)?.profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')) ? '' : (contracts.find((c) => c.contractId == selectedContract)?.loans + contracts.find((c) => c.contractId == selectedContract)?.profit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} </h5>
                                                </div>

                                                <div className="text-center mt-4 btn-group p-3 m-l-2">
                                                    <div className="text-center m-auto">

                                                        <div className="text-center m-auto">
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary "
                                                                style={{width: '130px'}}>
                                                                <Link to="/nav/info-store/"
                                                                      className="text-center text-light"><b>Quay lại</b></Link>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="text-center m-auto">


                                                        <div className="text-center m-auto">
                                                            <button
                                                                    disabled={!selectedContract} type="submit"
                                                                    className="btn btn-success"
                                                                    style={{width: '130px'}}>
                                                                <b className="text-center">Thanh toán</b>
                                                            </button>
                                                        </div>


                                                    </div>

                                                </div>
                                            </Form>
                                        </>




                            </Formik>


                        </div>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {/*Chọn hợp đồng*/}

        </>


    )

}