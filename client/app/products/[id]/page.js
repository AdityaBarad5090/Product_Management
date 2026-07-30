import ProductDetails from "./productdetails";

const API = "http://server:5000/products";

async function getProduct(id) {
    const res = await fetch(`${API}/${id}`, {
        cache: "no-store",
    });

    const data = await res.json();

    return data.product;
}

export async function generateMetadata({ params }) {
    const { id } = await params;
        
    const product = await getProduct(id);

    if (!product) {
        return {
            title: "Product Not Found",
            description: "This product does not exist.",
        };
    }

    return {
        title: product.name,
        description: product.details,

        keywords: [
            product.name,
            product.category,
            "Product Management",
            "Next.js",
        ],
    };
}

export default async function Page() {
    return <ProductDetails />;
}