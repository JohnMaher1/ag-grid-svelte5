# Svelte 5 AG Grid

A Svelte component for integrating AG Grid with Svelte 5

## Installation

```bash
npm install ag-grid-svelte5
```

## Main Features

- Create custom cells with Svelte components 🚀
- Create various themes that will auto-update when changed 🎟
- Fully Svelte 5 Compatible 💨
- Please visit the [repo](https://github.com/JohnMaher1/ag-grid-svelte5) for demo usage 💡

## Examples

### Standard Grid with custom theme and reactive data

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

### Custom Cell Renderer

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
				cellRenderer: ExampleCustomCellComp, // Class that extends SvelteRendererComp, see ExampleCustomCell.svelte
				cellRendererParams: {
					value: 'overriddenValue', // E.g. override the default value
					context: { someAdditionalContext: 'additionalContextData' } as RowData2Context // Add context if needed
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

#### Custom Cell Svelte Component

```
<script lang="ts" module>
    // All functions and properties can be overriden in this class
    // SvelteRendererComp implements ICellRendererComp from AG Grid
    // Visit the AG Grid docs you would like to customise this more!
    export class ExampleCustomCellComp extends SvelteRendererComp {
    	render() {
    		// Unmount is handled is base class.
    		this.comp = mount(Test, {
    			target: this.eGui!,
    			props: this.params
    		});
    	}
    }
</script>

<script lang="ts">
	let props: ICellRendererParams<RowData2, string, RowData2Context> = $props();
</script>



<div>
	Name: {props.data?.name}, Desc: {props.value}, Context: {props.context.someAdditionalContext}
</div>
```

### Custom themes

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
