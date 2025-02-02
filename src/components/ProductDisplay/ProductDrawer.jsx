import {Box, Button, TextField, Typography} from "@mui/material";
import React from "react";
import {grey} from "@mui/material/colors";

const ProductDrawerContent = (product, setIsDrawerOpen) => (
    <Box
        sx={{
            width: 550,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}
    >
        <Typography variant="h6">Product Name:</Typography>
        <Typography color={grey["700"]}>
            {product.name}
        </Typography>
        <Typography variant="h6">Product Description:</Typography>
        <Typography color={grey["700"]}>
            {product.description}
        </Typography>

        <Typography variant="h6" sx={{mt: 2}}>Properties</Typography>
        {product.productDetail.map((property, index) => (
            <Box key={index} sx={{display: 'flex', gap: 1, alignItems: 'center', backgroundColor: index%2 === 0? "grey.200": "white"}}>
                <Typography color={grey["700"]}>
                    {property.propertyName}:
                </Typography>
                <Typography color={grey["700"]}>
                    {property.propertyValue}
                </Typography>
            </Box>
        ))}

        <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3}}>
            <Button onClick={() => setIsDrawerOpen(false)} variant="outlined">
                Close
            </Button>
        </Box>
    </Box>
);

export default ProductDrawerContent;