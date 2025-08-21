import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InsightWellLogo } from "@/components/icons";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <InsightWellLogo className="h-6 w-6 text-primary" />
        <span className="font-headline text-lg font-semibold">InsightWell</span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <Avatar>
          <AvatarImage src="https://placehold.co/100x100.png" alt="@user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
