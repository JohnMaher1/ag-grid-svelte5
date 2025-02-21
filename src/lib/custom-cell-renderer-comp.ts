import type { ICellRendererComp, ICellRendererParams } from '@ag-grid-community/core';
import { unmount, type Component, mount } from 'svelte';

export interface AgGridSvelteRendererParams<T extends Record<string, any>>
	extends ICellRendererParams {
	component: Component<T>;
}

export class AgGridSvelteRendererComp<T extends Record<string, any> & ICellRendererParams>
	implements ICellRendererComp
{
	public eGui: HTMLElement | undefined;
	public comp: Record<string, any> | undefined = undefined;

	init(params: AgGridSvelteRendererParams<T>): void {
		this.eGui = document.createElement('div');
		this.eGui.style.height = '100%';
		this.render(params.component, params);
	}

	render(component: Component<T>, props: AgGridSvelteRendererParams<T>) {
		this.comp = mount(component, {
			target: this.eGui!,
			props: props as unknown as T
		});
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
		return false;
	}
}
