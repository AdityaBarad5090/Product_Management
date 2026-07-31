import ProductDetails from "./productdetails";

const API = `${process.env.NEXT_PUBLIC_API_URL}/products`;

async function getProduct(id) {
    const res = await fetch(`${API}/${id}`, { cache: "no-store" });

    if (!res.ok) {
        console.error(`Failed to fetch product ${id}, status: ${res.status}`);
        return null;
    }

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