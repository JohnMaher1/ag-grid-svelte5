import {
	AgPromise,
	type FrameworkOverridesIncomingSource,
	type IFrameworkOverrides
} from '@ag-grid-community/core';

export class SvelteFrameworkOverrides implements IFrameworkOverrides {
	setInterval(action: any, interval?: any): AgPromise<number> {
		return new AgPromise<number>((resolve) => {
			const id = window.setInterval(action, interval);
			resolve(id);
		});
	}

	addEventListener(
		element: HTMLElement,
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void {
		element.addEventListener(type, listener, options);
	}

	wrapIncoming: <T>(callback: () => T, source?: FrameworkOverridesIncomingSource) => T = (
		callback,
		source
	) => {
		return callback();
	};

	wrapOutgoing: <T>(callback: () => T) => T = (callback) => {
		return callback();
	};

	shouldWrapOutgoing?: boolean | undefined = false;

	frameworkComponent(name: string, components?: any) {
		if (components && components[name]) {
			return components[name];
		}
	}

	renderingEngine: 'vanilla' | 'react' = 'vanilla';

	getDocLink(path?: string): string {
		const baseUrl = 'https://www.npmjs.com/package/ag-grid-svelte5';
		return path ? `${baseUrl}/${path}` : baseUrl;
	}

	getLockOnRefresh?(): void {
		// Implement logic to lock on refresh if needed
		//console.log('Lock on refresh acquired');
	}

	releaseLockOnRefresh?(): void {
		// Implement logic to release lock on refresh if needed
		//console.log('Lock on refresh released');
	}

	runWhenReadyAsync?(): boolean {
		// Implement logic to determine if async operations should run when ready
		return true;
	}

	isFrameworkComponent(comp: any): boolean {
		return !!comp && typeof comp === 'object' && 'render' in comp;
	}
}
