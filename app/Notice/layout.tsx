
import Chat from "@/components/layout/chat";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <html lang="en" data-theme='light'>
            <head />
            <body>

                <div className="bg-[#A02635] relative font-bebasNeue">

                    
                    <div className="w-full h-full min-h-[100vh] ">
                        
                        {children}
                    
                    </div>

                </div>
            </body>
        </html>
    )
}
