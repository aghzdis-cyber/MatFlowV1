import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ModuleCardProps {
    title: string;
    description: string;
    metricText: string;
    progress: number;
    icon: LucideIcon;
    href?: string;
}

export function ModuleCard({ title, description, metricText, progress, icon: Icon, href }: ModuleCardProps) {
    const CardContent = (
        <div className="bg-[#2a2e6f] rounded-xl p-6 shadow-sm border border-[#3e438c] flex flex-col justify-between hover:border-[#5257a6] transition-colors cursor-pointer group h-full">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[#f97316] font-semibold text-lg">{title}</h3>
                    <div className="p-1.5 border border-[#444a9e] rounded-lg">
                        <Icon className="text-[#848cb8] group-hover:text-white transition-colors" size={20} />
                    </div>
                </div>
                <p className="text-[#a6add7] text-sm leading-relaxed pr-6 mb-8">
                    {description}
                </p>
            </div>

            <div className="mt-auto">
                <div className="text-white text-xs font-medium mb-3">
                    {metricText}
                </div>
                <div className="w-full bg-[#1e2254] rounded-full h-1.5 overflow-hidden">
                    <div
                        className="bg-[#f97316] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href} className="block h-full">{CardContent}</Link>;
    }

    return CardContent;
}
