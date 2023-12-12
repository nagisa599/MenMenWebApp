export interface Coupon {
    id: string;
    name: string;
    content: string;
    target: string;
    expire: Date;
    createdAt: Date;
    image: string;
}