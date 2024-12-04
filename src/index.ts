import { StringBuilder } from "@rbxts/string-builder";

export function timestampTag(): string {
	const date = DateTime.now().ToLocalTime();
	return "%02d:%02d:%02d".format(date.Hour, date.Minute, date.Second);
}

export abstract class OutputStream {
	public static readonly RobloxConsole = new class extends OutputStream {
		public default(message: string): void {
			print(message);
		}

		public warn(message: string): void {
			warn(message);
		}

		public error(message: string): void {
			error(message);
		}
	};

	public abstract default(message: string): void;
	public abstract warn(message: string): void;
	public abstract error(message: string): void;
}

export enum LogLevel {
	Default,
	Warn,
	Error
}

export class Logger {
	public constructor(
		private readonly output: OutputStream,
		private readonly defaultTags: (() => string)[] = []
	) { }

	public fatal(message: string, tags: string[] = []): void {
		tags.unshift("fatal");
		this.log(message, tags, LogLevel.Error);
	}

	public warn(message: string, tags: string[] = []): void {
		tags.unshift("warning");
		this.log(message, tags, LogLevel.Warn);
	}

	public info(message: string, tags: string[] = []): void {
		tags.unshift("info");
		this.log(message, tags);
	}

	protected log(message: string, tags: string[], level = LogLevel.Default): void {
		const methodName = <Lowercase<keyof typeof LogLevel>>LogLevel[level].lower();
		const fullMessage = new StringBuilder;
		for (const getTag of this.defaultTags)
			tags.push(getTag());
		for (const tag of tags)
			fullMessage.append(`[${tag.upper()}] `);

		fullMessage.append(message);
		this.output[methodName](fullMessage.toString());
	}
}