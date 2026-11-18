import { redirect } from "next/navigation";
import { adminWhatsAppUrl } from "@/lib/whatsapp";

export default function ChatPage() {
  redirect(adminWhatsAppUrl);
}
