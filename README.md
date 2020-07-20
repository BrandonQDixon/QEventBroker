# QEventBroker

QEventBroker is an API which provides event broker functionality: dispatch and subscribe to events via observables.

**NOTE:** this is a work in progress and should not yet be used in any production software.

![Statements](./coverage/badge-statements.svg)
![Coverage](./coverage/badge-lines.svg)
![Functions](./coverage/badge-functions.svg)
![Branches](./coverage/badge-branches.svg)

# Install

```
npm install q-event-broker
```

# Usage
Creating the event broker:
```typescript
const eventBroker = new QEventBroker();
```

Subscribing to an event type:
```typescript
//subscribe to an event of type "color"
eventBroker.event$(color).subscribe((data) => {
	console.log(data);
});
```

Subscribing to all events in a single observable:
```typescript
//subscribe to all events
eventBroker.events$.subscribe((event: IQNodeEvent) => {

	switch (event.type) {
		case "color":
			console.log(event.data);
			break;
	}

});
```

Dispatching an event
```typescript
//dispatch event directly
eventBroker.dispatch(<IQEvent>{
	type: "color",
	data: "green"
});

//dispatch event via class method decorator
class Test {

	@DispatchOnReturn({
		eventBroker: eventBroker,
		type: "color",
	})
	getColor() {
		return "green";
	}
	
	@DispatchOnReturn({
		eventBroker: eventBroker,
		type: "color",
		mapReturnValue: (data) => data.color,
	})
	getColorMapDispatch() {
		return {
			color: "green"
		};
	}
}
```