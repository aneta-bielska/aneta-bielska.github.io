---
layout: post
title: "Benchmarking Elixir - List and Tuple example"
date: 2017-02-28 11:00:23 +0100
comments: true
categories: blog
tags:
- elixir
- benchmark
image:
  feature: empty-large.png
  teaser: empty-small.png
---




## Intro

In this post you will get familiar with basics of benchmark tool for elixir.
As the title mentioned I am going to test elixir collection types: tuple and list.

A note.
For my tests I chose Benchee.
But there are other benchmark tools, for example Benchfella and Bmark.


## Benchmark tool setup

Setup is quite straight forward.
Create a new test app with `mix new test_app`.
Add `{:benchee, "~> 0.6", only: :dev}` to `deps` in `mix.ex`.
Install via `mix deps.get` .
And you are ready to go.

```elixir
# benchmark/test_01.ex
Benchee.run(%{
  "test 1 name" => fn -> do_sth end,
  "test 2 name" => fn -> do_sth_else end
}, time: 3)
```

Then in terminal:

```
mix run benchmark/test_01.ex
```

Short explanation of test results:

* __ips__ - iterations per second (the higher the better)
* __average__ - average execution time (the lower the better)
* __deviation__ - standard deviation (how much do the results vary), given as a percentage of the average
* __median__ - when all measured times are sorted, this is the middle value (the lower the better)

For more details please check [docs][benchee].

## Preparing tests

Let's consider three different actions:

  * count elements
  * read an element (first/last)
  * insert new element (at the beginning/end)

```elixir
list = Enum.to_list(1..100_000)
tuple = List.to_tuple(list)

Benchee.run(%{
  "list count"           => fn -> length(list) end,
  "tuple count"          => fn -> tuple_size(tuple) end,

  "tuple read first"     => fn -> elem(tuple, 0) end,
  "list read first"      => fn -> hd(list) end,
  "tuple read last"      => fn -> elem(tuple, 99_999) end,
  "list read last"       => fn -> Enum.at(list, 99_999) end,

  "tuple prepend"        => fn -> put_elem(tuple, 0, :t) end,
  "list prepend"         => fn -> List.insert_at(list, 0, :l) end,
  "tuple append"         => fn -> put_elem(tuple, 99_999, :t) end,
  "list append"          => fn -> List.insert_at(list, 99_999, :l) end,
}, time: 3)
```

As a side note results on every test run can slightly vary.
To make results more similar you can for instance increase value of time param.


## Results


Test general info output:

```
Erlang/OTP 19 [erts-8.2] [source] [64-bit] [smp:8:8] [async-threads:10]
  [kernel-poll:false]
Elixir 1.4.0
Benchmark suite executing with the following configuration:
warmup: 2.0s
time: 3.0s
parallel: 1
inputs: none specified
Estimated total run time: 50.0s
```

We have two very visible test result groups - one really fast and one distinctly slower.

#### Winners take it all - the best test cases

Reading a tuple element or counting its elements is really, really fast.
In case of lists, reading or inserting elements at the beginning is also impressively fast.

```
Name                           ips        average  deviation         median
tuple read last            63.03 M      0.0159 μs    ±13.65%      0.0150 μs
tuple read first           62.75 M      0.0159 μs    ±13.03%      0.0150 μs
list read first            61.57 M      0.0162 μs     ±7.49%      0.0160 μs
tuple count                59.56 M      0.0168 μs    ±10.58%      0.0160 μs
list prepend               40.72 M      0.0246 μs    ±14.50%      0.0240 μs
```

#### A group of the slowest test cases

Tuple: inserting elements, List: checking length, reading or inserting at the end - those are very expensive actions.

```
Name                           ips        average  deviation         median
tuple append             0.00981 M      101.89 μs    ±87.42%       39.00 μs
tuple prepend            0.00978 M      102.28 μs    ±88.63%       38.00 μs
list count               0.00937 M      106.76 μs     ±6.45%      105.00 μs
list read last           0.00171 M      585.80 μs     ±3.46%      577.00 μs
list append              0.00073 M     1375.25 μs     ±6.50%     1418.00 μs
```

Tests summary:

`+` better / `-` worse

| action | LIST | TUPLE |
|---|:---:|:-----:|
| count | - | + |
| prepend | + | - |
| append | - | - |
| read first | + | + |
| read last | - | + |
{:.mbtablestyle}

<style type="text/css">

  .mbtablestyle {
        border-collapse: collapse;
        width: 100%;
      }
  table, td, th {
        border: 1px solid #999;
        padding: 7px 14px;
        min-width: 60px;
        }
</style>

#### concat example

Let's have a closer look at concat function.
Based on earlier examples, you probably can already guess results of this test:

```
Benchee.run(%{
  "concat v1"  => fn -> [1] ++ list end,
  "concat v2" => fn -> list ++ [1] end,
}, time: 3)
```

Results for 100 000 element list:

```
Name                ips        average  deviation         median
concat v1       64.05 M      0.0156 μs    ±46.82%      0.0150 μs
concat v2     0.00308 M      324.25 μs    ±70.52%      191.00 μs
```
Results for 100 element list:

```
Name                ips        average  deviation         median
concat v1       65.55 M      0.0153 μs    ±24.90%      0.0150 μs
concat v2        7.02 M       0.142 μs  ±1372.85%       0.100 μs
```

Again, as amount of list elements increases the speed significantly drops if appended. It is ~9 times slower than prepending for 100 elements
and ~20000 times slower for 100 000 elements.
Whereas if list is prepended results stay almost the same regardless of length - it is really fast.

## About Lists and Tuples - summary

Answer to a question _why there is such difference_ can be found in elixir guide about [basic types][basic-types]:

#### Lists

> Lists are stored in memory as linked lists, meaning that each element in a list holds its value and points to the following element until the end of the list is reached. We call each pair of value and pointer a cons cell.
> This means accessing the length of a list is a linear operation: we need to traverse the whole list in order to figure out its size. Updating a list is fast as long as we are prepending elements.

#### Tuples

> Tuples, on the other hand, are stored contiguously in memory. This means getting the tuple size or accessing an element by index is fast. However, updating or adding elements to tuples is expensive because it requires copying the whole tuple in memory.
> Those performance characteristics dictate the usage of those data structures. One very common use case for tuples is to use them to return extra information from a function.


#### To visualise the difference:

<img src="/assets/images/data_str.png" title="tuple vs. linked list">

For more on data structures you can check [this yt channel][ds-yt] or [this cheatsheet][ds-cheatsheet].

## summary

As you can see tuples and lists behaviour significantly differ, thus they have different usage.
Using benchmark tool showed vividly those differences.

Thank you for your attention and I hope you could learn something.

[twitter]: https://twitter.com/aneta_bielska
[ds-cheatsheet]: http://bigocheatsheet.com/
[ds-yt]: https://www.youtube.com/watch?v=lC-yYCOnN8Q
[basic-types]: http://elixir-lang.org/getting-started/basic-types.html#lists-or-tuples
[benchee]: https://github.com/PragTob/benchee
