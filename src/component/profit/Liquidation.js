import React from "react";
import {useOutletContext} from "react-router";

export default function Liquidation() {
    const liquidations = useOutletContext();
    return (
        <>
            <div style={{height: ""}}>
                <table className="table table-hover table-striped" border={1}>
                    <thead>
                    <tr>
                        <th>Mã Hd</th>
                        <th>Tiền mua</th>
                        <th>Tiền bán</th>
                        <th>Ngày thanh lý</th>
                        <th>Lợi nhuận</th>
                        <th id="actions">Tùy chọn</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        liquidations ?
                            liquidations.map((liquidation, index) =>
                                <tr key={index}>
                                    <td>{liquidation.contractCode}</td>
                                    <td>{liquidation.loans}</td>
                                    <td>{liquidation.proceedsOfSale}</td>
                                    <td>{liquidation.createDate}</td>
                                    <td>{liquidation.profit}</td>
                                    <td className="detail-button">
                                        <a href="#">
                                            <i
                                                className="bi bi-info-circle detail"
                                                title="Chi tiết"
                                            />
                                        </a>
                                    </td>
                                </tr>
                            )
                            :
                            <tr>
                                <td colSpan="7">
                                    <div align="center">
                                        <h1>Data Not Found</h1>
                                    </div>
                                </td>
                            </tr>
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}