import { NextResponse } from "next/server";

const CATTLE_DESCRIPTIONS: Record<string, Record<string, string>> = {
  Cow: {
    Gir: "Ye Gir cow bahut hi sehatmand aur high milk yield wali hai. Rozana 12-15 litre dudh deti hai. Iska temperament bahut calm hai aur dairy farming ke liye best hai. Fully vaccinated aur dewormed hai. Iski umar 4 saal hai aur abhi 3-4 saal aur productive rahegi. Breed quality pure hai aur iska weight bhi standard hai.",
    Sahiwal: "Ye Sahiwal cow pure breed ki hai aur high butterfat milk ke liye jaani jaati hai. Rozana 10-12 litre dudh jiska fat 5% hai. Bahut docile aur easy to manage hai. Haryana ke branded farm se hai. Vaccination complete hai. Iski umar 3 saal hai aur healthy hai.",
    Jersey: "Ye Jersey cross cow excellent health record ke saath hai. Rozana 14-16 litre dudh deti hai. Chhoti dairy farms ke liye ideal hai. Fully vaccinated aur regular checkup hota hai. Feed efficient hai aur kam khane mein bhi high production deti hai.",
    Tharparkar: "Ye Tharparkar cow native breed hai aur arid regions ke liye hardy hai. Heat tolerance bahut accha hai aur disease resistance bhi strong hai. Rozana 8-10 litre dudh. Kam paani aur kam chare mein bhi acchi production. Rajasthan ke pure breed program se hai.",
    default: "Ye cow healthy hai aur dairy farming ke liye ready hai. Vaccination complete hai. Contact karke aur jaankari le sakte hain.",
  },
  Buffalo: {
    Murrah: "Ye Murrah buffalo premium breed hai. Dudh mein fat content bahut high hai (6-7%). Rozana 8-10 litre dudh. Pregnancy verified hai local vet se. Punjab ke famous Murrah farm se hai. Vaccinated aur dewormed hai. Umr 5 saal hai aur bahut healthy hai.",
    Jaffarabadi: "Ye Jaffarabadi buffalo heavy breed hai aur Gujarat ki famous breed hai. Rozana 10-12 litre dudh jiska fat 7% tak hai. Strong build aur disease resistant hai. Pure breed certification available hai.",
    default: "Ye buffalo healthy aur productive hai. Dudh production accha hai aur vaccination complete hai. Visit karke dekh sakte hain.",
  },
  Goat: {
    Jamunapari: "Ye Jamunapari goat strong build ka hai. Breeding programmes ke liye best hai. Active aur disease-free hai. Rozana 3-4 litre dudh. Uttar Pradesh ke registered breeder se hai. Primary vaccination complete hai. Umr 2 saal.",
    Beetal: "Ye Beetal goat Punjab ki famous breed hai. Heavy weight aur good meat quality. Dairy aur meat dono ke liye accha. Healthy herd se hai. Vaccination complete hai.",
    default: "Ye goat healthy hai aur ready for sale hai. Vaccination complete hai. Contact karein.",
  },
  Sheep: {
    Dorper: "Ye Dorper sheep hardy breed hai aur arid climates ke liye suitable hai. Ready for sale hai. Three healthy sheep available hain. Recent PPR + ET vaccination complete hai. Meat quality excellent hai. Rajasthan ke registered farm se hai.",
    Nali: "Ye Nali sheep fine wool aur meat dono ke liye famous hai. Healthy aur well-fed. Vaccination complete hai. Contact karke aur dekhein.",
    default: "Ye sheep healthy hai aur ready for sale hai. Vaccination aur deworming complete hai.",
  },
  Other: {
    default: "Ye cattle healthy hai aur ready for sale hai. Sabhi necessary vaccinations complete hain. Farm verified animal hai. Visit karke inspection kar sakte hain.",
  },
};

function generateDescription(type: string, breed: string): string {
  const typeData = CATTLE_DESCRIPTIONS[type];
  if (!typeData) return CATTLE_DESCRIPTIONS.Other.default;

  return typeData[breed] || typeData.default || CATTLE_DESCRIPTIONS.Other.default;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, breed } = body;

    if (!type || !breed) {
      return NextResponse.json(
        { error: "Type aur breed dono batayein" },
        { status: 400 },
      );
    }

    const description = generateDescription(type, breed);

    return NextResponse.json({ description, success: true });
  } catch {
    return NextResponse.json(
      { error: "Kuch gadbad hui. Phir se try karein." },
      { status: 500 },
    );
  }
}
