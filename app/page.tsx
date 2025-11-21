'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  Users,
  Calendar,
  Award,
  Target,
  Heart,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Play,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function HomePage() {
  const router = useRouter();
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest_type: '',
    preferred_trainer: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryForm),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setEnquiryForm({
          name: '',
          email: '',
          phone: '',
          interest_type: '',
          preferred_trainer: '',
          message: '',
        });
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">O2 Fitness</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-slate-300 hover:text-white transition">
                About
              </a>
              <a href="#events" className="text-slate-300 hover:text-white transition">
                Events
              </a>
              <a href="#gallery" className="text-slate-300 hover:text-white transition">
                Gallery
              </a>
              <a href="#contact" className="text-slate-300 hover:text-white transition">
                Contact
              </a>
            </div>
            <Button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              Member Login
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Transform Your Body.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                Transform Your Life.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Premium training, personalized diets, expert coaching. Your journey to excellence
              starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-6"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started - Free Consultation
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 text-lg px-8 py-6"
              >
                View Programs
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          >
            {[
              { icon: Target, title: 'Personal Training', desc: 'One-on-one expert guidance' },
              { icon: Heart, title: 'Diet Plans', desc: 'Customized nutrition programs' },
              { icon: Users, title: 'Group Classes', desc: 'Motivating group sessions' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-xl hover:bg-slate-800/70 transition-all duration-300 group">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">About Our Gym</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We are a premium fitness facility dedicated to helping you achieve your health and
              fitness goals. With state-of-the-art equipment, expert trainers, and personalized
              programs, we provide everything you need to succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Certified Trainers',
                desc: 'All our trainers are certified professionals with years of experience',
              },
              {
                icon: Target,
                title: 'Goal-Oriented',
                desc: 'We create custom plans tailored to your specific fitness objectives',
              },
              {
                icon: Users,
                title: 'Community',
                desc: 'Join a supportive community of like-minded fitness enthusiasts',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800/50 border-slate-700 h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{item.title}</CardTitle>
                    <CardDescription className="text-slate-400">{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="events" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Recent Events</h2>
            <p className="text-xl text-slate-300">Check out our latest gym activities and events</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Summer Fitness Challenge 2024',
                date: 'June 15, 2024',
                desc: 'An intensive 6-week transformation program with amazing results',
                img: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg',
              },
              {
                title: 'New Trainer Workshop',
                date: 'July 10, 2024',
                desc: 'Introduction to our new certified personal trainers',
                img: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg',
              },
              {
                title: 'Nutrition Seminar',
                date: 'August 5, 2024',
                desc: 'Learn about proper nutrition and meal planning for fitness',
                img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
              },
            ].map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden group hover:border-orange-500 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.img}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {event.date}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white">{event.title}</CardTitle>
                    <CardDescription className="text-slate-400">{event.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-slate-300 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                    >
                      View Gallery
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Photos & Videos Gallery
            </h2>
            <p className="text-xl text-slate-300">
              Witness the transformation and energy of our gym
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
              'https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg',
              'https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg',
              'https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg',
              'https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg',
              'https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg',
              'https://images.pexels.com/photos/3775164/pexels-photo-3775164.jpeg',
              'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg',
            ].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-xl text-slate-300">
              Ready to start your fitness journey? Contact us today!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Send us an Enquiry</CardTitle>
                  <CardDescription className="text-slate-400">
                    Fill out the form and we will get back to you shortly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEnquirySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={enquiryForm.name}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, name: e.target.value })
                        }
                        className="bg-slate-900 border-slate-700 text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={enquiryForm.email}
                          onChange={(e) =>
                            setEnquiryForm({ ...enquiryForm, email: e.target.value })
                          }
                          className="bg-slate-900 border-slate-700 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-300">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={enquiryForm.phone}
                          onChange={(e) =>
                            setEnquiryForm({ ...enquiryForm, phone: e.target.value })
                          }
                          className="bg-slate-900 border-slate-700 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest" className="text-slate-300">
                        Interest Type
                      </Label>
                      <Select
                        value={enquiryForm.interest_type}
                        onValueChange={(value) =>
                          setEnquiryForm({ ...enquiryForm, interest_type: value })
                        }
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                          <SelectValue placeholder="Select your interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal_training">Personal Training</SelectItem>
                          <SelectItem value="diet_plan">Diet Plan</SelectItem>
                          <SelectItem value="group_classes">Group Classes</SelectItem>
                          <SelectItem value="membership">Membership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trainer" className="text-slate-300">
                        Preferred Trainer (Optional)
                      </Label>
                      <Input
                        id="trainer"
                        value={enquiryForm.preferred_trainer}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, preferred_trainer: e.target.value })
                        }
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-slate-300">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        value={enquiryForm.message}
                        onChange={(e) =>
                          setEnquiryForm({ ...enquiryForm, message: e.target.value })
                        }
                        className="bg-slate-900 border-slate-700 text-white min-h-32"
                        required
                      />
                    </div>

                    {submitSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"
                      >
                        Thank you! Your enquiry has been submitted successfully.
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Enquiry
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">Address</h3>
                        <p className="text-slate-400">
                          8-368, 3d Floor, Mangamuru Rd, Pandaripuram, Ongole, 
                          <br />
                          Andhra Pradesh 523002
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">Phone</h3>
                        <p className="text-slate-400">+9199664 50789</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">Email</h3>
                        <p className="text-slate-400">info@O2Fitness.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">Opening Hours</h3>
                        <p className="text-slate-400">
                          Mon - Sat: 5:00 AM To 11:00 AM & 4:00PM TO 10:00 PM
                          <br />
                           Sunday: 5:00 AM - 10:00 AM
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map((social) => (
                      <Button
                        key={social}
                        variant="outline"
                        size="icon"
                        className="border-slate-700 hover:border-orange-500 hover:bg-orange-500/10"
                      >
                        <span className="sr-only">{social}</span>
                        <Users className="h-5 w-5 text-slate-400" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">O2 Fitness</span>
          </div>
          <p className="text-slate-400 mb-6">
            Transform Your Body. Transform Your Life.
          </p>
          <p className="text-slate-500 text-sm">
            © 2024 O2 Fitness. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
