import React from 'react';
const S = require('sanctuary');
const R = require('ramda');
import './style.css';

const C1 = ({ p1, children }) => (
  <div>
    C1 - p1 - {p1}
    <div>--------------</div>
    children:{children}
    {console.log(children)}
    <div>--------------</div>
  </div>
);

const C2 = ({ p2, children }) => (
  <div>
    C2 - p2 - {p2}
    <div>--------------</div>
    children: {children}
    <div>--------------</div>
  </div>
);

const C3 = ({ p3, children }) => (
  <div>
    C3 - p3 - {p3}
    <div>--------------</div>
    children:{children}
    <div>--------------</div>
  </div>
);

const id = (x) => `ID - ${x}`;

// contramap props always pick?
// reduce props recursively?
const composeCs = (Cs) => Cs.reduce();

// ------------->
// C1(C2(C3()))

// R.call(
//  C2, {children:R.call(C3, props),...props}
// )

const renderCs = ([C1, C2, C3], allProps) => {
  return (
    <C1
      p1={allProps.p1}
      children={C2({
        p2: 20,
        children: C3({ p3: 30 }),
      })}
    />
  );
};

{
  /* // <C1 {...allProps}>
    //   <C2 {...allProps}>
    //     <C3 {...allProps} />
    //   </C2>
    // </C1> */
}
const reduceCs = (Cs, props) =>
  Cs.reduce(
    (acc, curr) => {
      //R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
      //R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}});
      //=> {a: {b: {c: 42}}}
      return R.assoc('children', curr(props), acc);
    },
    { props: props, children: null }
  );
const contraMapC = (cMap, renderC) => S.contramap(cMap)(renderC);

// {p1} -> JSX
const contraMapC1 = contraMapC(R.pick(['p1', 'children']), C1);
// {p2} -> JSX
const contraMapC2 = contraMapC(R.pick(['p2', 'children']), C2);
// {p3} -> JSX
const contraMapC3 = contraMapC(R.pick(['p3', 'children']), C3);

const Cs = [contraMapC1, contraMapC2, contraMapC3];

const props = { p1: 10, p2: 20, p3: 30 };

export default function App() {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <div>
        {renderCs(Cs, props)}
        {console.log(reduceCs(Cs, props), 's')}
        {/* <C1 p1={10}>
          <C2 p2={20}>
            <C3 p3={30} />
          </C2>
        </C1> */}
      </div>
    </div>
  );
}
