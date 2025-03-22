# Svelte 5 AG Grid

A Svelte component for integrating AG Grid with Svelte 5

## Installation

```bash
npm i ag-grid-svelte5
pnpm i ag-grid-svelte5
bun install ag-grid-svelte5
yarn install ag-grid-svelte5
```

# Table of contents

1. [Main Features](#mainfeatures)
2. [How this Library Works](#works)
   1. [Overview](#worksoverview)
   2. [Custom Cells](#workscells)
3. [Examples](#examples)
   1. [Standard](#example1)
   2. [Custom Cell](#example2)
   3. [Custom Theme](#example3)
4. [General and Contact](#general)

## Main Features <a name="mainfeatures"></a>

- Create custom cells with Svelte components 🚀
- Create various themes that will auto-update when changed 🎟
- Fully Svelte 5 Compatible 💨
- Please visit the [GitHub](https://github.com/JohnMaher1/ag-grid-svelte5) for demo usage 💡

### How this library works <a name="works"></a>

#### Overview <a name="worksoverview"></a>

This library creates a Svelte component based on the Javascript version of AG Grid. The svelte component contains a div component where the grid is placed and has an internal reference to the grid api returned from ag grids `createGrid` function. To render the grid inside this svelte component overrides are required to tell the grid we are using a framework to render the grid.

#### Custom Cells <a name="workscells"></a>

AG Grid provides 2 main ways to render a custom cell.

1. A function which returns a gui element (e.g. a div containing your cell data)
2. A class that implements `ICellRendererComp`

The first instance only returns a gui element which will not work to render our custom svelte component and its required props.

The second instance is what this library uses. This library exports the class `AgGridSvelteRendererComp` which implements AG Grids `ICellRendererComp`. This class contains the methods required to render the svelte component, pass the required parameters, and cleanup the component once its deleted. The main functions are `init` to setup the parameters and `render` which simply calls Svelte's `mount` function to mount/render the component.

Because a component cannot be passed in as a generic type to a class. A 'hack' is used to carry some of the weight in `cellRendererParams` which includes the component instance and the props to be passed.

I would strongly advise looking into the documentation for AG Grid particulary around custom components if this is something you are interested in. There are many cases where the generic `AgGridSvelteRendererComp` may not meet your needs, so it may be recommened to create your own class that implements ` ICellRendererComp`. E.g. a different `refresh` function which only refreshes the cell when `x` value changes.

## Examples <a name="examples"></a>

### Standard Grid with custom theme and reactive data <a name="example1"></a>

```svelte
<script lang="ts">
	let rowData: RowData1[] = $state([
		{ id: 1, make: 'Toyota', model: 'Celica', price: 35000 },
		{ id: 2, make: 'Ford', model: 'Mondeo', price: 32000 },
		{ id: 3, make: 'Porsche', model: 'Boxster', price: 72000 }
	]);
	let gridOptions: GridOptions<RowData1> = $state({
		columnDefs: [{ field: 'id' }, { field: 'make' }, { field: 'model' }, { field: 'price' }],
		// Important for reducing dom updates and improving performance
		getRowId: (params) => params.data.id.toString(),
		domLayout: 'autoHeight',
		theme: themeQuartz
	});

	// Simple change detection to show reactivity
	setInterval(() => {
		rowData = [
			{ id: 1, make: 'Ford', model: 'Mondeo', price: 32000 },
			{ id: 2, make: 'Toyota', model: 'Celica', price: 35000 },
			{ id: 3, make: 'Porsche', model: 'Boxster', price: rowData[2].price + 1 }
		];
	}, 1000);
</script>

<AgGridSvelte5Component {gridOptions} {rowData} theme={selectedTheme} {modules} />
```

### Custom Cell Renderer <a name="example2"></a>

#### Main Svelte Component

```
<script lang="ts">
	let rowDataTwo: RowData2[] = $state([
		{ name: 'John', desc: 'Desc1' },
		{ name: 'Jane', desc: 'Desc2' },
		{ name: 'Jack', desc: 'Desc3' }
	]);

	let gridOptionsTwo: GridOptions<RowData2> = $state({
		columnDefs: [
			{ field: 'name' },
			{
    			field: 'desc',
    			// Important: Both cellRenderer AND cellRendererParams is required
    			cellRenderer: AgGridSvelteRendererComp,
    			cellRendererParams: (params: ExampleCellProps) => {
    				// (Optional): Add a custom prop to the cell renderer alongside ag grids params
    				params.additionalProp1 = 'Hello there';
    				// (Optional) Add additional context to the cell renderer
    				params.context = {
    					someAdditionalContext: 'Some additional context'
    				};
    				// Required: Return the cell renderer params including the component to render
    				const cell: AgGridSvelteRendererParams<ExampleCellProps> = {
    					component: ExampleCustomCell, // .svelte component
    					...params // .svelte component props which extend ICellRendererParams
    				};
    				return cell;
    			}
			}
		],
		getRowId: (params) => params.data.name,
		domLayout: 'autoHeight',
		theme: themeQuartz
	});
</script>

<AgGridSvelte5Component
		gridOptions={gridOptionsTwo}
		rowData={rowDataTwo}
		theme={selectedTheme}
		{modules}
    />
```

```
<script module>
	import type { RowData2, RowData2Context } from './+page.svelte';
	import type { ICellRendererParams } from '@ag-grid-community/core';

	export interface ExampleCellProps extends ICellRendererParams<RowData2, string, RowData2Context> {
		// (Optional) Add additional props here
		additionalProp1: string;
	}
</script>

<script lang="ts">
	let props: ExampleCellProps = $props();
</script>

<div style="overflow-x: auto;">
	This is an additional prop: '{props.additionalProp1}'. This is a standard ag grid prop: '{props.data?.name}'. This is a context prop: '{props.context?.someAdditionalContext}'.
</div>
```

### Custom themes <a name="example3"></a>

```
<script lang="ts">
	const themeOne = themeQuartz.withParams({
		accentColor: '#EE28ED',
		backgroundColor: '#1f2836',
		browserColorScheme: 'dark',
		chromeBackgroundColor: {
			ref: 'foregroundColor',
			mix: 0.07,
			onto: 'backgroundColor'
		},
		foregroundColor: '#FFF',
		headerFontSize: 14
	});

	const themeTwo = themeQuartz.withParams({
		accentColor: '#33E34B',
		backgroundColor: '#b7b3b3',
		browserColorScheme: 'light',
		chromeBackgroundColor: {
			ref: 'foregroundColor',
			mix: 0.07,
			onto: 'backgroundColor'
		},
		foregroundColor: '#000',
		headerFontSize: 14
	});

	let selectedTheme = $state(themeOne);
</script>

<div>
	<button
		style="margin-bottom: 8px;"
		onclick={() => (selectedTheme = selectedTheme === themeOne ? themeTwo : themeOne)}
		>Change Theme</button
	>

	<AgGridSvelte5Component
        gridOptions={gridOptionsTwo}
        rowData={rowDataTwo}
        theme={selectedTheme} // Changes when selectedTheme updates!
        {modules}
    />

</div>
```

#### General and Contact <a name="general"></a>

If you have any suggestions/feedback it would be greatly appreciated. Please visit the [GitHub](https://github.com/JohnMaher1/ag-grid-svelte5) to raise any issues or possible changes!

If you would like to contact me. Here is my website: https://www.john-maher.dev with contact information.
