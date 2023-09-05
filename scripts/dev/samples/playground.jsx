let a = 0;

a ++;

{/* <div $$App>
    <If data={a < 1}>
1: a &lt; 1
    </If>
    <Else>
1: a &gt; 1
    </Else>
</div>; */}
<div $$App>
    11
    <If data={a < 4}>
        a &lt; 4;
        <If data={a < 3}>
            1: a &lt; 3;
            <If data={a < 2}>
                11: a = 1;
            </If>
            <Else>
                11: a = 2
            </Else>
        </If>
        <Else>
            1: a = 3
        </Else>
        22
    </If>
    <Else>
        <If data={a < 5}>
            2:a = 4
        </If>
        <Else>
            2:a &gt; 6
        </Else>
    </Else>
</div>;

// a.v = 4
// a.v = 1