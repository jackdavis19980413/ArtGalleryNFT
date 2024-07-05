import React, { useState } from "react";

import ListDialog from "../Modals/ListDialog";
import BuyDialog from "../Modals/BuyDialog";
import Web3 from "web3"

export default function Gallery({ gallery, account, refresh }) {
    const [isListOpen, setIsListOpen] = useState(false);
    const [isBuyOpen, setIsBuyOpen] = useState(false);
    const [art, setArt] = useState({});

    const onListBtn = (art_id) => {
        setArt({ id: art_id })
        setIsListOpen(true)
    }

    const onBuyBtn = (art_id, art_price) => {
        setArt({ id: art_id, price: Web3.utils.fromWei(art_price, 'ether') })
        setIsBuyOpen(true)
    }

    return (gallery.length && (
        <div className="p-6 text-gray-900 dark:text-gray-100">
            <ListDialog isOpen={isListOpen} onCloseFunc={setIsListOpen} refresh={refresh} art={art} />
            <BuyDialog isOpen={isBuyOpen} onCloseFunc={setIsBuyOpen} refresh={refresh} art={art} />
            <table className="mt-3 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr>
                        <th className="px-3 py-3">TokenId</th>
                        <th className="px-3 py-3">Image</th>
                        <th className="px-3 py-3">Creator</th>
                        <th className="px-3 py-3">Owner</th>
                        <th className="px-3 py-3">Listed</th>
                        <th className="px-3 py-3">Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {gallery.map((art, index) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            key={index}>
                            <td className="px-3 py-2">
                                {art.id}
                            </td>
                            <td className="px-3 py-2">
                                <div className="flex space-x-2">
                                    <img src={art.uri} style={{ width: 60 }} alt="" />
                                </div>
                            </td>
                            <td className="px-3 py-2">
                                {art.creator}
                            </td>
                            <td className="px-3 py-2">
                                {art.owner}
                            </td>
                            <td className="px-3 py-2">
                                {art.listedForSale && (
                                    <span>{Web3.utils.fromWei(art.price, 'ether')} ETH</span>
                                )}
                            </td>
                            <td className="px-3 py-2">
                                {art.owner === account && (
                                    <button
                                        onClick={(e) => onListBtn(art.id)}
                                        className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline mx-1"
                                    >
                                        List
                                    </button>
                                )}
                                {art.listedForSale && (art.owner !== account) && (
                                    <button
                                        onClick={(e) => onBuyBtn(art.id, art.price)}
                                        className="font-medium text-emerald-600 dark:text-emerald-500 hover:underline mx-1"
                                    >
                                        Buy
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )

    )
}