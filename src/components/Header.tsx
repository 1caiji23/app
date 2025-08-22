import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InsightWellLogo } from "@/components/icons";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Link href="/" className="flex items-center gap-2">
        {/* 使用本地logo图片 */}
        <Image 
          src="/PupilClub-logo.png" 
          alt="潮瞳派Logo" 
          width={32} 
          height={32} 
          className="h-8 w-8 object-contain"
          priority
        />
        <span className="font-headline text-lg font-semibold">潮瞳派</span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <Avatar>
          {/* 使用本地猫头鹰图片作为用户头像 */}
          <AvatarImage src="/maotouy.png" alt="用户头像" />
          <AvatarFallback>猫</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
