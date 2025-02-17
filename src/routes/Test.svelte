<script module>
	import { SvelteRendererComp } from '$lib/helpers.svelte.js';
	import type { ICellRendererComp, ICellRendererParams } from '@ag-grid-community/core';
	import { mount } from 'svelte';
	import Test from './Test.svelte';

	export class TestComp extends SvelteRendererComp implements ICellRendererComp {
		render() {
			this.comp = mount(Test, {
				target: this.eGui!,
				props: this.params
			});
		}
	}
</script>

<script lang="ts">
	let props: ICellRendererParams<any, string, any> = $props();
</script>

<div>Hi {props.value}</div>
