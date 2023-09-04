let a = -1;

a ++;
/*
<If data={a < 1}>
1: a &lt; 1
</If>
<Else>
1: a &gt; 1
</Else>
*/
<div $$App>
    <If data={a < 2}>
        <If data={a < 1}>
            1: a &lt; 1
        </If>
        <Else>
            1: a &gt; 1
        </Else>
    </If>
    <Else>
        <If data={a < 3}>
            2:a &lt; 3
        </If>
        <Else>
            2:a &gt; 3
        </Else>
    </Else>
</div>;