var documenterSearchIndex = {"docs":
[{"location":"interface/#Allocator-interface","page":"Allocator interface","title":"Allocator interface","text":"","category":"section"},{"location":"interface/","page":"Allocator interface","title":"Allocator interface","text":"The allocator interface is currently considered experimental and not part of the public API.","category":"page"},{"location":"interface/","page":"Allocator interface","title":"Allocator interface","text":"AllocArrays.Allocator","category":"page"},{"location":"interface/#AllocArrays.Allocator","page":"Allocator interface","title":"AllocArrays.Allocator","text":"abstract type Allocator end\n\nAlloactors need to subtype Alloactor and implement two methods of alloc_similar:\n\nAllocArrays.alloc_similar(::Allocator, arr, ::Type{T}, dims::Dims)\nAllocArrays.alloc_similar(::Allocator, ::Type{Arr}, dims::Dims) where {Arr<:AbstractArray}\n\nwhere the latter is used by broadcasting.\n\n\n\n\n\n","category":"type"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = AllocArrays","category":"page"},{"location":"#AllocArrays","page":"Home","title":"AllocArrays","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"API Documentation for AllocArrays. See also the README at that link for more examples and notes.","category":"page"},{"location":"#Public-API","page":"Home","title":"Public API","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"AllocArray\nwith_locked_bumper\nAllocArrays.unsafe_with_bumper","category":"page"},{"location":"#AllocArrays.AllocArray","page":"Home","title":"AllocArrays.AllocArray","text":"struct AllocArray{T, N,A<:AbstractArray{T,N}} <: AbstractArray{T,N}\n    arr::A\nend\n\nWrapper type which forwards most array methods to the inner array arr, but dispatches similar to special allocation methods.\n\n\n\n\n\n","category":"type"},{"location":"#AllocArrays.with_locked_bumper","page":"Home","title":"AllocArrays.with_locked_bumper","text":"with_locked_bumper(f, buf::AllocBuffer)\n\nRuns f() in the context of using a LockedBumperAllocator to allocate memory to similar calls on AllocArrays.\n\nAll such allocations should occur within an @no_escape block, and of course, no such allocations should escape that block.\n\nThread-safe: f may spawn multiple tasks or threads, which may each allocate memory using similar calls on AllocArray's. However:\n\nwarning: Warning\nf must call @no_escape only outside of the threaded region, since deallocation in the bump allocator (via @no_escape) on one task will interfere with allocations on others.\n\nExample\n\nusing AllocArrays, Bumper\n\nbuf = AllocBuffer()\ninput = AllocArray([1,2,3])\nc = Channel(Inf)\nwith_locked_bumper(buf) do\n    # ...code with may be multithreaded but which must not escape or return newly-allocated AllocArrays...\n    @no_escape buf begin # called outside of threaded region\n        @sync for i = 1:10\n            Threads.@spawn put!(c, sum(input .+ i))\n        end\n    end\n    close(c)\nend\nsum(collect(c))\n\n# output\n225\n\n\n\n\n\n","category":"function"},{"location":"#AllocArrays.unsafe_with_bumper","page":"Home","title":"AllocArrays.unsafe_with_bumper","text":"unsafe_with_bumper(f, buf::AllocBuffer)\n\nRuns f() in the context of using a BumperAllocator{typeof(buf)} to allocate memory to similar calls on AllocArrays.\n\nAll such allocations should occur within an @no_escape block, and of course, no such allocations should escape that block.\n\nwarning: Warning\nNot thread-safe. f must not allocate memory using similar calls on AllocArray's across multiple threads or tasks.\n\nRemember: if f calls into another package, you might not know if they use concurrency or not! It is safer to use with_locked_bumper for this reason.\n\nExample\n\nusing AllocArrays, Bumper\nusing AllocArrays: unsafe_with_bumper\n\ninput = AllocArray([1,2,3])\nbuf = AllocBuffer()\nunsafe_with_bumper(buf) do\n     @no_escape buf begin\n        # ...code with must not allocate AllocArrays on multiple tasks via `similar` nor escape or return newly-allocated AllocArrays...\n        sum(input .* 2)\n     end\nend\n\n# output\n12\n\n\n\n\n\n","category":"function"}]
}
