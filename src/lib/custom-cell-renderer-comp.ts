import type { ICellRendererComp, ICellRendererParams } from '@ag-grid-community/core';
import { unmount } from 'svelte';

export class SvelteRendererComp implements ICellRendererComp {
	public eGui: HTMLElement | undefined;
	public comp: Record<string, any> | undefined = undefined;
	public params: ICellRendererParams = {} as ICellRendererParams;
	public props: Record<string, any> = {};

	init(params: ICellRendererParams): void {
		this.eGui = document.createElement('div');
		this.params = params;
		this.eGui.style.height = '100%';
		this.render();
	}

	render() {
		throw new Error('Subclass must implement render method');
	}

	getGui() {
		if (!this.eGui) {
			this.eGui = document.createElement('div');
		}
		return this.eGui;
	}

	destroy() {
		this.eGui?.remove();
		if (this.comp) {
			unmount(this.comp);
		}
	}

	refresh(): boolean {
		return true;
	}
}
