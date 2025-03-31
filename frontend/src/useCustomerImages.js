import { useState } from "react";

export function useCustomerImages() {
    const customerImages = [
        "/images/customers/customer1.png",
        "/images/customers/customer2.png",
        "/images/customers/customer3.png",
        "/images/customers/customer4.png",
        "/images/customers/customer5.png",
    ];

    const [customerImage, setCustomerImage] = useState("/images/customers/empty.png");

    const setRandomCustomerImage = () => {
        const randomIndex = Math.floor(Math.random() * customerImages.length);
        const randomCustomer = customerImages[randomIndex];
        setCustomerImage(randomCustomer);
    };

    return { customerImage, setRandomCustomerImage };
}