import Movie from '../models/movie.js';

//create
const createMovie = async (data) =>{
    try{
    const movie = new Movie(data);
    return await movie.save();
    }catch(error)
    {
        throw new Error("Lỗi khi tạo phim: " + error.message);
    }
}

//get list all
const getAllMovies = async () => {
    try {
        const movies = await Movie.find() // Lấy danh sách phim
            .populate('showtime'); // Nếu bạn muốn lấy thông tin showtime, giữ lại dòng này
        return movies; // Trả về danh sách phim
    } catch (error) {
        throw new Error("Error retrieving movie list: " + error.message);
    }
};

//newmovie 
const getNewestMovies = async () => {
    try {
        const movies = await Movie.find() // Assuming you want movies from the year 2025
            .sort({ createdAt: -1 }); // Sort by createdAt descending
        return movies;
    } catch (error) {
        throw new Error("Error retrieving newest movies: " + error.message);
    }
};

//get id
const getMovie = async(id)=>{
    try{
        const movie = await Movie.findById(id).populate('showtime');
        if(!movie) throw new Error("Phim khong ton tai" + error.message);
        return movie;
   }catch(errror)
   {
        throw new Error("Loi khi lay phim: " + error.message);
   }
};

//update 
const updateMovie = async(id,data) => {
    try{
        const movie = await Movie.findByIdAndUpdate(id, data, { new: true });
        if (!movie) throw new Error("Phim không tồn tại");
        return movie;
    }catch(error)
    {
        throw new Error("Lỗi khi cập nhật phim: " + error.message);
    }
};

//delete
const deleteMovie = async(id)=>{
    try{
        const movie = await Movie.findByIdAndDelete(id);
        if(!movie) throw new Error("Phim không tồn tại");
        return movie;
    }catch(errror)
    {
        throw new Error("Lỗi khi xóa phim: " + error.message);
    }
};

export { createMovie, getAllMovies, getMovie, updateMovie, deleteMovie, getNewestMovies };




