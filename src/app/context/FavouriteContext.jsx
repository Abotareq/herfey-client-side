'use client';
import { createContext, useContext, useState } from "react";
const FavContext = createContext();
export const FavouriteContext = ({children}) => {
    const [fav, setFav] = useState([]);
    const toggleFav = (product) => {
        setFav((prev) => {
            if(prev.find((p) => p._id === product._id)){
                return prev.filter((p) => p._id !== product._id)
            } else{
                return[...prev, product]
            }
        })
    };
    return (
    <FavContext.Provider value={{fav, toggleFav}}>
        {children}
    </FavContext.Provider>
  )
}
export const useFav = () => useContext(FavContext);