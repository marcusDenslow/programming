import { Angular, Arduino, Assembly, AuthJS, C, CPP, CSharp, Docker, Firebase, JavaScript, NextJS, NodeJS, PostgreSQL, Python, React, Rust, ShadCN, Swift, TailwindCSS, TypeScript } from "../components/icons";

export type Tag = {
	name: string;
	url?: string;
	icon?: React.ReactNode;
};

export const tags = {
	react: {
		name: "React",
		url: "https://react.dev",
		icon: <React size={24} className="tag-icon-react" />,
	},
	nextjs: {
		name: "Next.js",
		url: "https://nextjs.org",
		icon: <NextJS size={24} className="tag-icon-nextjs" />,
	},
	tailwindcss: {
		name: "Tailwind CSS",
		url: "https://tailwindcss.com",
		icon: <TailwindCSS size={24} className="tag-icon-tailwind" />,
	},
	typescript: {
		name: "TypeScript",
		url: "https://typescriptlang.org",
		icon: <TypeScript size={24} className="tag-icon-typescript" />,
	},
	javascript: {
		name: "JavaScript",
		icon: <JavaScript size={24} className="tag-icon-javascript" />,
	},
	nodejs: {
		name: "Node.js",
		url: "https://nodejs.org",
		icon: <NodeJS size={24} className="tag-icon-nodejs" />,
	},
	firebase: {
		name: "Firebase",
		url: "https://firebase.google.com",
		icon: <Firebase size={24} className="tag-icon-firebase" />,
	},
	postgresql: {
		name: "PostgreSQL",
		url: "https://postgresql.org",
		icon: <PostgreSQL size={24} className="tag-icon-postgresql" />,
	},
	rust: {
		name: "Rust",
		url: "https://rust-lang.org",
		icon: <Rust size={28} className="tag-icon-rust" />,
	},
	docker: {
		name: "Docker",
		url: "https://docker.com",
		icon: <Docker size={24} className="tag-icon-docker" />,
	},
	shadcnui: {
		name: "shadcn/ui",
		url: "https://ui.shadcn.com",
		icon: <ShadCN size={24} className="tag-icon-shadcn"/>,
	},
	authjs: {
		name: "Auth.js",
		url: "https://authjs.dev",
		icon: <AuthJS size={24} className="tag-icon-authjs" />,
	},
	assembly: {
		name: "Assembly",
		icon: <Assembly size={24} className="tag-icon-assembly" />,
	},
	cpp: {
		name: "C++",
		url: "https://isocpp.org",
		icon: <CPP size={24} className="tag-icon-cpp" />,
	},
	arduino: {
		name: "Arduino",
		url: "https://arduino.cc",
		icon: <Arduino size={24} className="tag-icon-arduino" />,
	},
	swift: {
		name: "Swift",
		url: "https://swift.org",
		icon: <Swift size={24} className="tag-icon-swift" />,
	},
	angular: {
		name: "Angular",
		url: "https://angular.dev",
		icon: <Angular size={24} className="tag-icon-angular" />,
	},
	csharp: {
		name: "C#",
		url: "https://learn.microsoft.com/en-us/dotnet/csharp/",
		icon: <CSharp size={24} className="tag-icon-csharp" />,
	},
	c: {
		name: "C",
		url: "https://en.wikipedia.org/wiki/C_(programming_language)",
		icon: <C size={24} className="tag-icon-c" />,
	},
	python: {
		name: "Python",
		url: "https://python.org",
		icon: <Python size={24} className="tag-icon-python" />,
	},
	ncurses: {
		name: "ncurses",
		url: "https://invisible-island.net/ncurses/",
		icon: <Assembly size={24} className="tag-icon-ncurses" />,
	},
}
