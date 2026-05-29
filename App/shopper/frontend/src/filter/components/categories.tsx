import { getCategory } from "../model";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useContext } from "react";
import { FilterContext } from "@/context/FilterContext";

type Category = {
  id: string;
  name: string;
};

export default function Categories(){
    const {setCategory} = useContext(FilterContext);
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
            async function load() {
                const data = await getCategory();
                setCategories(data);
            }
            load();
    }, []);
    return (
        categories.map((category) => {
            return <Button
                fullWidth
                variant="contained"
                onClick={() => setCategory(category.id)}
                sx={{ justifyContent: 'flex-start' }}
                >
                {category.name}
                </Button>
        })
    )
}