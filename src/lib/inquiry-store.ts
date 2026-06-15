export interface InquiryItem {
  id: string;
  listingId: string;
  sellerId: string;
  buyerName: string;
  buyerPhone: string;
  message: string;
  cattleName: string;
  cattleBreed: string;
  timestamp: string;
}

const inquiries: InquiryItem[] = [];

export function addInquiry(inquiry: Omit<InquiryItem, "id" | "timestamp">) {
  const item: InquiryItem = {
    ...inquiry,
    id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };
  inquiries.unshift(item);
  return item;
}

export function getInquiriesForSeller(sellerId: string): InquiryItem[] {
  return inquiries.filter((i) => i.sellerId === sellerId);
}

export function getInquiryCount(sellerId: string): number {
  return inquiries.filter((i) => i.sellerId === sellerId).length;
}
