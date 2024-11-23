---
layout: post
title: "How to get pretty ruby console output"
categories: journal
tags: [ruby,programming]
# image: mountains.jpg
---

<style type="text/css">
  pre code.language-cust {
    white-space: pre-wrap;
  }
</style>

# The problem

Dull and difficult to read `rails console` output.

Example:

```cust
> Movie.first
  Movie Load (0.3ms)  SELECT  "movies".* FROM "movies" ORDER BY "movies"."id" ASC LIMIT ?  [["LIMIT", 1]]
 => #<Movie id: 1, title: "Batman", year: 1989, genre: "Action, Adventure", director: "Tim Burton", production: "USA, Great Britain", boxoffice: "$411 348 924", description: "The Dark Knight of Gotham City begins his war on c...", score: 7.6, created_at: "2016-07-23 09:47:15", updated_at: "2016-07-23 09:47:15">
```

# Built-in tools

## Yaml

```
y Movie.first
```

# Solutions

There are couple of ways to get pretty output - list or a table output.
For list output formatting use `pry`, `yaml` or `awesome_print`.
And for table output formatting use `hirb` or `irbtools`.

### [Pry][pry]

Add `pry` to Gemfile and bundle. Then simply type `pry` in rails console:

```
> pry
```

You will be redirected to pry console, where output will use pry formatting.

```
pry(main)>
```

Pry example:

``` ruby
> Movie.first
  Movie Load (0.3ms)  SELECT  "movies".* FROM "movies" ORDER BY "movies"."id" ASC LIMIT ?  [["LIMIT", 1]]
=> #<Movie:0x0000003e525358
 id: 1,
 title: "Batman",
 year: 1989,
 genre: "Action, Adventure",
 director: "Tim Burton",
 production: "USA, Great Britain",
 boxoffice: "$411 348 924",
 description: "The Dark Knight of Gotham City begins his war on c...",
 score: 7.6,
 created_at: Sat, 23 Jul 2016 09:47:15 UTC +00:00,
 updated_at: Sat, 23 Jul 2016 09:47:15 UTC +00:00>

```

### [Yaml][yaml]

Second way is to use `yaml`.
Note I added here `attributes`.
It would render additional info without it.

```
> y Movie.last.attributes
```

or

```
> puts Movie.last.attributes.to_yaml
```

Yaml example:

```cust
> puts Movie.last.attributes.to_yaml
  Movie Load (0.3ms)  SELECT  "movies".* FROM "movies" ORDER BY "movies"."id" DESC LIMIT ?  [["LIMIT", 1]]
---
id: 1
title: Batman
year: 1989
genre: Action, Adventure
director: Tim Burton
production: USA, Great Britain
boxoffice: "$411 348 924"
description: The Dark Knight of Gotham City begins his war on c...
score: 7.6
created_at: !ruby/object:ActiveSupport::TimeWithZone
  utc: &1 2016-07-23 09:47:15.879669000 Z
  zone: &2 !ruby/object:ActiveSupport::TimeZone
    name: Etc/UTC
  time: *1
updated_at: !ruby/object:ActiveSupport::TimeWithZone
  utc: &3 2016-07-23 09:47:15.879669000 Z
  zone: *2
  time: *3
```

### [Awesome print][awesome_print]

Add `gem 'awesome_print'` to Gemfile and bundle. In rails console:

```
> require 'awesome_print'
```

You need to add `ap` before object you want to format.

```
> ap Movie.first
```

Awesome_print example:

```ruby
> ap Movie.first
  Movie Load (0.2ms)  SELECT  "movies".* FROM "movies" ORDER BY "movies"."id" ASC LIMIT ?  [["LIMIT", 1]]
#<Movie:0x00000003fcf7f8> {
             :id => 1,
          :title => "Batman",
           :year => 1989,
          :genre => "Action, Adventure",
       :director => "Tim Burton",
     :production => "USA, Great Britain",
      :boxoffice => "$411 348 924",
    :description => "The Dark Knight of Gotham City begins his war on c...",
          :score => 7.6,
     :created_at => Sat, 23 Jul 2016 09:47:15 UTC +00:00,
     :updated_at => Sat, 23 Jul 2016 09:47:15 UTC +00:00
}
```

### [Hirb][hirb]

Add `gem 'hirb'` to Gemfile and bundle. In rails console:

```
> require 'hirb'
```

and

```
> Hirb.enable
```

Hirb example:

```cust
> Movie.select("title, year, genre,director").first
  Movie Load (0.3ms)  SELECT  title, year, genre,director FROM "movies" ORDER BY "movies"."id" ASC LIMIT ?  [["LIMIT", 1]]
+----+--------+------+-------------------+------------+
| id | title  | year | genre             | director   |
+----+--------+------+-------------------+------------+
|    | Batman | 1989 | Action, Adventure | Tim Burton |
+----+--------+------+-------------------+------------+
1 row in set
```

It doesn't look good on table with too many columns. To make it look pretty I picked only few columns.

### [Irbtools][irbtools]

Add `gem 'irbtools'` to Gemfile and bundle.

In rails console require irbtools.

```
require 'irbtools'
```

Irbtools example:

```cust
> Movie.select("title, year, genre,director").first #=> #<Movie id: nil, title: "Batman", year: 1989, genre: "Action, Adventure", director: "Tim Burton">
  Movie Load (0.3ms)  SELECT  title, year, genre,director FROM "movies" ORDER BY "movies"."id" ASC LIMIT ?  [["LIMIT", 1]]
┌────┬────────┬──────┬───────────────────┬────────────┐
│ id │ title  │ year │ genre             │ director   │
├────┼────────┼──────┼───────────────────┼────────────┤
│    ╎ Batman ╎ 1989 ╎ Action, Adventure ╎ Tim Burton │
└────┴────────┴──────┴───────────────────┴────────────┘
1 row in set
```

It is similar to hirb but it also adds colors and looks a bit smoother.

### [Table print][tp]

One more table formatting alternative is table_print.
Add `gem 'table_print'` to Gemfile and bundle.

You need to add `tp` before object you want to format.

```
> tp Movie.first
```

Table_print example:

```
> tp Movie.first, "title", "year", "genre", "director"
  Movie Load (0.1ms)  SELECT  "movies".* FROM "movies" ORDER BY "movies"."id" ASC LIMIT ?  [["LIMIT", 1]]
TITLE  | YEAR | GENRE             | DIRECTOR
-------|------|-------------------|-----------
Batman | 1989 | Action, Adventure | Tim Burton
```


Note: if any option is not working for you it might be because of different Ruby / RubyOnRails version. I am using Ruby 2.3.0 and RubyOnRails 5.0.0.

<br>
That's all folks. Feel free to share your thoughts in comments.

<br>
Follow me on [twitter][twitter] to stay up to date.

[twitter]: https://twitter.com/aneta_bielska]
[pry]: https://github.com/pry/pry
[yaml]: http://ruby-doc.org/stdlib-2.2.3/libdoc/yaml/rdoc/YAML.html
[awesome_print]: https://github.com/awesome-print/awesome_print
[hirb]: https://github.com/cldwalker/hirb
[irbtools]: https://github.com/janlelis/irbtools
[tp]: https://github.com/arches/table_print
